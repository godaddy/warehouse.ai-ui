/* eslint no-process-env: 0 */

const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const analyze = process.env.ANALYZE;

const env = analyze ? 'production' : process.env.NODE_ENV;

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'index.js')
  ],
  mode: env !== 'production' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              javascriptEnabled: true
            }
          }]
      }
    ]
  },
  resolve: { extensions: ['.mjs', '.js', '.jsx', '.json'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'build.js'
  },
  plugins: env === 'production' ? [analyze && new BundleAnalyzerPlugin()].filter(Boolean) : [new webpack.HotModuleReplacementPlugin()]
};
