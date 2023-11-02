const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { execFileSync } = require('child_process');
const paths = require('react-scripts/config/paths');

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
  buffer: require.resolve('buffer'),
  https: require.resolve('https-browserify')
};

module.exports = {
  fallback,
  webpack: function (config, env) {
    // find first loader and use babel.config.js
    const firstRule = config.module.rules[0].oneOf.find((c) => c.loader);
    firstRule.options.plugins.push([
      path.resolve('./plugins/operator-overloading.js'),
      {
        classNames: ['BigDecimal']
      }
    ]);

    config.resolve.fallback = fallback;

    // do not check issues
    config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin');

    // update vendor hash
    const vendorPath = path.resolve('node_modules', '.cache', 'vendor');
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

    // if (!isDevelopment && process.env.SENTRY_AUTH_TOKEN) {
    // const SentryWebpackPlugin = require('@sentry/webpack-plugin');
    //   config.devtool = 'source-map';
    //   config.plugins.push(
    //     new SentryWebpackPlugin({
    //       org: 'oraichain',
    //       project: 'oraidex',

    //       // Specify the directory containing build artifacts
    //       include: './build',

    //       // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
    //       // and needs the `project:releases` and `org:read` scopes
    //       authToken: process.env.SENTRY_AUTH_TOKEN,

    //       // Optionally uncomment the line below to override automatic release name detection
    //       release: process.env.RELEASE
    //     })
    //   );
    // }

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest
      })
    );
    return config;
    // return rewiredEsbuild(config, env);
  },
  jest: (config) => {
    config.setupFiles = ['<rootDir>/jest.setup.ts'];
    return config;
  }
};
