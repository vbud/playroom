const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const getStaticTypes = require('./getStaticTypes');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const includePath = path.resolve(__dirname, '../src');

module.exports = async (options) => {
  const staticTypes = await getStaticTypes();

  return {
    mode: options.production ? 'production' : 'development',
    entry: {
      index: [require.resolve('../src/index.js')],
      preview: [require.resolve('../src/preview.js')],
    },
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve('../dist'),
      publicPath: '',
    },
    resolve: {
      fallback: {
        path: false,
        fs: false,
      },
      extensions: ['.mjs', '.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        __PLAYROOM_ALIAS__COMPONENTS__: require.resolve('./components'),
        __PLAYROOM_ALIAS__SNIPPETS__: require.resolve('./snippets'),
      },
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      // Removing this line seems to break @babel/standalone, so keep it for now.
      exprContextCritical: false,
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: includePath,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    { shippedProposals: true },
                  ],
                  require.resolve('@babel/preset-react'),
                  require.resolve('@babel/preset-typescript'),
                ],
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          include: includePath,
          // TODO: remove?
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    { shippedProposals: true },
                  ],
                  require.resolve('@babel/preset-react'),
                ],
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
      }),
      new HtmlWebpackPlugin({
        title: 'Composer',
        chunksSortMode: 'none',
        chunks: ['index'],
        filename: 'index.html',
        base: '',
      }),
      new HtmlWebpackPlugin({
        title: 'Composer Preview',
        chunksSortMode: 'none',
        chunks: ['preview'],
        filename: 'preview/index.html',
        publicPath: '../',
      }),
      new VanillaExtractPlugin(),
      new MiniCssExtractPlugin({ ignoreOrder: true }),
      ...(options.production ? [] : [new FriendlyErrorsWebpackPlugin()]),
    ],
    devtool: !options.production && 'eval-source-map',
  };
};
