const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { NODE_ENV } = process.env
const isDev = !NODE_ENV
const isBuild = NODE_ENV === 'build'
const isTemp = NODE_ENV === 'temp'
const isProd = NODE_ENV === 'production'

const { hotPort, loaders } = require('./share')

module.exports = {
  entry: isBuild || isTemp ? {
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
    path: `${__dirname}/../${isBuild ? 'npm/dist' : isProd ? 'gh-pages' : 'dist'}`,
    filename: '[name].js',
    publicPath: isDev ? `http://0.0.0.0:${hotPort}/` : undefined,
    libraryTarget: isBuild ? 'commonjs2' : 'var',
  },

  resolve: {
    alias: {
      '~dist': `${__dirname}/../dist`,
      '~com': `${__dirname}/../src/components`,
    }
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

    ...isBuild || isTemp ? [] : [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'lib',
        filename: 'lib.js'
      }),
      new HtmlWebpackPlugin({
        title: 'Cepave - OWL UI',
        filename: 'index.html',
        template: './scripts/gh-pages.html',
      }),
    ],

    ...isDev ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : isBuild || isTemp ? [
      new ExtractTextPlugin('owl-ui.css'),
    ] : [
      new ExtractTextPlugin('app.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  ],
}
