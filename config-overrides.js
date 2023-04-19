const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { execFileSync } = require('child_process');
const paths = require('react-scripts/config/paths');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const fallback = {
  fs: false,
  tls: false,
  net: false,
  os: false,
  url: false,
  path: false,
  assert: false,
  querystring: false,
  http: require.resolve('stream-http'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  https: require.resolve('https-browserify')
};

const rewiredEsbuild = (config, env) => {
  const useTypeScript = fs.existsSync(paths.appTsConfig);
  const target = 'es2020';
  // replace babel-loader to esbuild-loader
  for (const { oneOf } of config.module.rules) {
    if (oneOf) {
      let babelLoaderIndex = -1;
      const rules = Object.entries(oneOf);
      for (const [index, rule] of rules.slice().reverse()) {
        if (rule.loader && rule.loader.includes(path.sep + 'babel-loader' + path.sep)) {
          oneOf.splice(index, 1);
          babelLoaderIndex = index;
        }
      }
      if (~babelLoaderIndex) {
        const options = {
          loader: useTypeScript ? 'tsx' : 'jsx',
          target
        };
        if (env !== 'development') {
          options.drop = ['console'];
        }
        oneOf.splice(babelLoaderIndex, 0, {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [paths.appSrc],
          loader: require.resolve('esbuild-loader'),
          options
        });
      }
    }
  }

  // replace minimizer
  for (const [index, minimizer] of Object.entries(config.optimization.minimizer).slice().reverse()) {
    const options = {
      target,
      css: true
    };
    // replace TerserPlugin to ESBuildMinifyPlugin
    if (minimizer.constructor.name === 'TerserPlugin') {
      config.optimization.minimizer.splice(index, 1, new ESBuildMinifyPlugin(options));
    }
    // remove OptimizeCssAssetsWebpackPlugin
    if (options.css && minimizer.constructor.name === 'OptimizeCssAssetsWebpackPlugin') {
      config.optimization.minimizer.splice(index, 1);
    }
  }

  return config;
};

module.exports = {
  fallback,
  webpack: function (config, env) {
    config.resolve.fallback = fallback;

    const isDevelopment = env === 'development';

    // do not check issues
    config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin');

    // update vendor hash
    const vendorPath = path.resolve('node_modules', '.vendor');
    const vendorHash = webpack.util.createHash('sha256').update(fs.readFileSync('yarn.lock')).digest('hex').slice(-8);
    const interpolateHtmlPlugin = config.plugins.find((c) => c.constructor.name === 'InterpolateHtmlPlugin');
    interpolateHtmlPlugin.replacements.VENDOR_VERSION = vendorHash;

    // add dll

    const manifest = path.join(vendorPath, `manifest.${vendorHash}.json`);
    if (fs.existsSync(manifest)) {
      console.log(`Already build vendor.${vendorHash}.js`);
    } else {
      execFileSync('node', ['scripts/vendor.js', vendorPath, vendorHash], {
        stdio: 'inherit',
        env: process.env,
        cwd: process.cwd()
      });
    }

    // try copy from cache to public for later copy
    const vendorFileSrc = path.join(vendorPath, `vendor.${vendorHash}.js`);
    const vendorFileDest = path.join(paths.appPublic, `vendor.${vendorHash}.js`);
    if (!fs.existsSync(vendorFileDest)) {
      fs.copyFileSync(vendorFileSrc, vendorFileDest);
    }

    if (!isDevelopment && process.env.SENTRY_AUTH_TOKEN) {
      config.devtool = 'source-map';
      config.plugins.push(
        new SentryWebpackPlugin({
          org: 'oraichain',
          project: 'oraidex',

          // Specify the directory containing build artifacts
          include: './build',

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and needs the `project:releases` and `org:read` scopes
          authToken: process.env.SENTRY_AUTH_TOKEN

          // Optionally uncomment the line below to override automatic release name detection
          // release: process.env.RELEASE,
        })
      );
    }

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest
      })
    );

    return rewiredEsbuild(config, env);
  },
  jest: (config) => {
    config.transformIgnorePatterns = ['node_modules/(?!@terran-one)'];
    config.setupFiles = ['<rootDir>/jest.setup.ts'];
    return config;
  }
};
