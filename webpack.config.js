const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/js/index.js',
  output: {
    publicPath: '/',
    filename: 'main.js',
    path: __dirname + '/dist',
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'fs': 'memfs',
    },
    fallback: {
      'url': require.resolve('url/'),
      'path': require.resolve('path-browserify'),
      'buffer': require.resolve('buffer/'),
      'stream': require.resolve('stream-browserify'),
      'assert': require.resolve('assert/'),
      'util': require.resolve('util/'),
    },
  },
  module: {
    rules: [],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    }),
    new webpack.ProvidePlugin({
      'process': 'process/browser',
    }),
  ],
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },
};
