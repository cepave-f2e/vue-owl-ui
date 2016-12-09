const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { NODE_ENV } = process.env
const isDev = !NODE_ENV
const isBuild = NODE_ENV === 'build'
const isTemp = NODE_ENV === 'temp'
const isProd = NODE_ENV === 'production'

const { hotPort, loaders } = require('./share')
const pkg = require('../package.json')

module.exports = {
  entry: isBuild || isTemp ? {
    'owl-ui': ['./src/components']
  } : {
    lib: ['vue', 'vue-router', 'delegate-to', 'mark-it-down', 'owl-icons'],
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
        test: /\.(svg|png|jpg)$/,
        loader: 'url',
      },
      {
        test: /\.js$/,
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
      },
      __pkgVer: `'${pkg.version}'`,
    }),

    ...isBuild || isTemp ? [] : [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'lib',
        filename: 'lib.js'
      }),
      new HtmlWebpackPlugin({
        title: 'OWL UI · Design System - Cepave F2E',
        filename: 'index.html',
        template: './scripts/gh-pages.html',
        minify: {
          collapseWhitespace: true,
        }
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
