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
    lib: ['vue', 'vue-router', 'delegate-to', 'mark-it-down', '@cepave/owl-icons'],
    app: [
      './src/client',
    ]
  },

  performance: {
    hints: isProd ? 'warning' : false,
  },

  devtool: isDev ? '#eval' : false,
  watch: isDev,

  output: {
    path: `${__dirname}/../${isBuild ? 'npm/dist' : isProd ? 'gh-pages' : 'dist'}`,
    filename: '[name].js',
    // publicPath: isDev ? `http://0.0.0.0:${hotPort}/` : undefined,
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
        loader: 'url-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      },
      ...isDev ? [loaders.css] : [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            loader: 'css-loader?modules&localIdentName=[hash:base64:5]!sass-loader',
            fallbackLoader: 'style-loader',
          })
        }
      ]
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV || 'development'),
      },
      __pkgVer: `'${pkg.version}'`,
    }),

    ...isDev || isProd ? [
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

      ...isProd ? [new ExtractTextPlugin('app.css')] : []
    ] : [
      new ExtractTextPlugin('owl-ui.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ],
  ],

  externals: isDev || isProd ? [] : Object.keys(pkg.dependencies),
}
