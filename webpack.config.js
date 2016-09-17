const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'
const pkg = require('./package.json')

const hotPort = 3032
const loaders = {
  css: {
    test: /\.s?css$/,
    loader: isDev ? [
      'style',
      'css?modules&localIdentName=[local]--[hash:base64:5]&sourceMap',
      'sass?sourceMap'
    ].join('!') : ExtractTextPlugin.extract({
      loader: 'css?modules&localIdentName=[hash:base64:5]!postcss',
      fallbackLoader: 'style',
    })
  }
}

module.exports = {
  loaders,
  hotPort,
  entry: {
    lib: ['vue', 'vue-router', 'delegate-to'],
    app: ['./src/client'].concat(
      isDev
        ? [`webpack-hot-middleware/client?path=http://0.0.0.0:${hotPort}/__webpack_hmr`]
        : []
    )
  },

  devtool: isDev ? '#eval': '',
  watch: isDev,

  output: {
    path: `${__dirname}/${isDev ? 'static' : 'gh-pages'}` ,
    filename: '[name].js',
    publicPath: isDev ? `http://0.0.0.0:${hotPort}/` : undefined,
  },

  module: {
    loaders: [
      {
        test:   /\.js/,
        exclude: /node_modules/,
        loader: 'babel'
      },
    ].concat(
      isDev
      ?
        [loaders.css]
      :
        [{

        }]
        : [
            {
              test: /\.s?css$/,
              loader: ExtractTextPlugin.extract({
                loader: 'css?modules&localIdentName=[hash:base64:5]!sass',
                fallbackLoader: 'style',
              })
            }
          ]
    )
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'lib',
      filename: 'lib.js'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      }
    }),
  ].concat(
    isDev
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin()
        ]
      :
        [
          new ExtractTextPlugin('app.css'),
          new HtmlWebpackPlugin({
            title: 'Cepave - OWL UI',
            filename: 'index.html',
            template: './scripts/gh-pages.html',
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        ]
  ),
}
