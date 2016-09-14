const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
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
    path: `${__dirname}/static`,
    filename: '[name].js',
    publicPath: `http://0.0.0.0:${hotPort}/`
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
    )
  },

  plugins: [
    // new ExtractTextPlugin('app.css'),
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
      : []
  ),

  externals: isDev ? [] : Object.keys(pkg.dependencies)
}
