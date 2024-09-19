const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { execFileSync } = require('child_process');
const paths = require('react-scripts/config/paths');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
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
  https: require.resolve('https-browserify'),
  zlib: require.resolve('browserify-zlib')
};
const fixBabelRules = (config) => {
  // find first loader and use babel.config.js
  let ruleInd = 0;
  let firstRule = true;
  const rules = config.module.rules[0].oneOf;
  while (rules && ruleInd < rules.length) {
    const rule = rules[ruleInd];
    if (rule.loader) {
      if (firstRule) {
        // ignore js and mjs and use just one
        rule.test = /\.(jsx|ts|tsx)$/;

        rule.options.plugins.push([
          '@oraichain/operator-overloading',
          {
            classNames: ['BigDecimal']
          }
        ]);
        firstRule = false;
      } else {
        rules.splice(ruleInd, 1);
        continue;
      }
    }
    ruleInd++;
  }
};
module.exports = {
  fallback,
  webpack: function (config, env) {
    fixBabelRules(config);
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ];
    config.resolve.fallback = fallback;
    const isDevelopment = env === 'development';

    // do not check issues
    config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin');
    config.resolve.plugins = config.resolve.plugins.filter((plugin) => !(plugin instanceof ModuleScopePlugin));

    config.plugins = [...config.plugins, new NodePolyfillPlugin()];
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

    if (!isDevelopment && process.env.SENTRY_AUTH_TOKEN) {
      config.devtool = 'source-map';
      config.plugins.push(
        sentryWebpackPlugin({
          org: 'oraichain',
          project: 'oraidex',
          authToken: process.env.SENTRY_AUTH_TOKEN
        })
      );
    }

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest
      })
    );
    return config;
  },
  devServer: function (configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      // Change the https certificate options to match your certificate, using the .env file to
      // set the file paths & passphrase.
      config.proxy = [
        {
          context: ['/v3'],
          // target: 'http://localhost:3001',
          changeOrigin: true
        }
      ];

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
  jest: (config) => {
    config.setupFiles = ['<rootDir>/jest.setup.ts'];
    return config;
  }
};
