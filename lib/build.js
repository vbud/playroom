#!/usr/bin/env node
const webpack = require('webpack');
const makeWebpackConfig = require('./makeWebpackConfig');

const noop = () => {};

(async (callback = noop) => {
  const webpackConfig = await makeWebpackConfig({ production: true });

  webpack(webpackConfig, (err, stats) => {
    // https://webpack.js.org/api/node/#error-handling
    if (err) {
      const errorMessage = [err.stack || err, err.details]
        .filter(Boolean)
        .join('/n/n');
      return callback(errorMessage);
    }

    if (stats.hasErrors()) {
      const info = stats.toJson();
      return callback(info.errors.join('\n\n'));
    }

    return callback();
  });
})();
