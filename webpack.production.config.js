/**
 * Created by andreivinogradov on 13.04.17.
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
});

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  allChunks: true,
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'whatwg-fetch',
      path.resolve(__dirname, 'static/application/App.js'),
    ],
    vendor: ['pixi', 'p2', 'phaser'],
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'static'),
    publicPath: './static/',
    filename: 'bundle.js',
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: ['node compileTemplates.js'],
    }),
    extractSass,
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      // minChunks: Infinity,
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      compress: true,
      comments:false,
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/,
      //   use: [
      //     'file-loader?name=images/[name].[ext]',
      //   ],
      // },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader',
        }),
      },
      { test: /\.js$/, use: ['transform-loader?brfs'] },
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'static') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  resolve: {
    alias: {
      phaser,
      pixi,
      p2,
    },
  },
};
