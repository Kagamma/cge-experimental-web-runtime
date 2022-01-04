const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    publicPath: '/',
    filename: 'main.js',
    path: __dirname + '/dist',
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
  ],
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },
};