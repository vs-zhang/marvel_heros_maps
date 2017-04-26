const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: ['./src/main.js'],
  devServer: {
    hot: true,
    inline: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 5001,
    contentBase: './src',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        loader: 'babel-loader',
        query: {
          presets: ["es2015", "stage-0", "react"]
        }
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader?limit=8192&name=images/[name]-[hash:6].[ext]'
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      chunkSortMode: 'dependency',
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: './src/index.tpl.html'
    })
  ],
  bail: true
};
