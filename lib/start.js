#!/usr/bin/env node
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const makeWebpackConfig = require('./makeWebpackConfig');
const portfinder = require('portfinder');

(async (callback) => {
  const webpackConfig = await makeWebpackConfig({
    production: false,
    infrastructureLogging: {
      level: 'none',
    },
    stats: {
      errorDetails: true,
    },
  });
  portfinder.getPort({ port: 9000 }, (portErr, availablePort) => {
    if (portErr) {
      console.error('portErr: ', portErr);
      return;
    }
    const webpackDevServerConfig = {
      hot: true,
      port: availablePort,
      open: false,
      devMiddleware: {
        stats: false,
      },
      compress: true,
      static: {
        watch: { ignored: /node_modules/ },
      },
    };

    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(webpackDevServerConfig, compiler);

    devServer.startCallback(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
})();
