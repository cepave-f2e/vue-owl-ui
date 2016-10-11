const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { NODE_ENV } = process.env
const isDev = !NODE_ENV
const isBuild = NODE_ENV === 'build'
const { hotPort, loaders } = require('./share')

if (!isDev) {
  const del = require('del')

  if (isBuild) {
    del('npm')
  } else {
    del('gh-pages')
  }
}

module.exports = {
  entry: isBuild ? {
    'owl-ui': ['./src/components']
  } : {
    lib: ['vue', 'vue-router', 'delegate-to', 'mark-it-down'],
    app: ['./src/client'].concat(
      isDev
        ? [`webpack-hot-middleware/client?path=http://0.0.0.0:${hotPort}/__webpack_hmr`]
        : []
    )
  },

  devtool: isDev ? '#eval' : false,
  watch: isDev,

  output: {
    path: `${__dirname}/../${isDev ? 'static' : isBuild ? 'npm/dist' : 'gh-pages'}` ,
    filename: '[name].js',
    publicPath: isDev ? `http://0.0.0.0:${hotPort}/` : undefined,
  },

  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.md$/,
        loader: 'raw'
      },
    ].concat(
      isDev
        ? [loaders.css]
        : [
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract({
                loader: 'css?modules&localIdentName=[hash:base64:5]!sass',
                fallbackLoader: 'style',
              })
            }
          ]
    )
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV || 'development'),
      }
    }),

    ...isBuild ? [] : [new webpack.optimize.CommonsChunkPlugin({
      name: 'lib',
      filename: 'lib.js'
    })],

    ...isDev ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : isBuild ? [
      new ExtractTextPlugin('owl-ui.css'),
    ] : [
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
  ],
}
