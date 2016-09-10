process.env.VUE_ENV = 'server'

import webpack from 'webpack'
import base from './webpack.config'

const cssLoaderIdx = base.module.loaders.indexOf(base.loaders.css)

const serverConfig = {
  ...base,
  target: 'node',
  devtool: null,
  entry: './src/server/entry',
  output: {
    ...base.output,
    libraryTarget: 'commonjs2',
    filename: 'app.server.js'
  },
  externals: Object.keys(require('./package.json').dependencies).concat('vue-router'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VUE_ENV: JSON.stringify('server')
      },
    })
  ],
  module: {
    loaders: base.module.loaders.filter((loader, i)=> i !== cssLoaderIdx).concat({
      ...base.loaders.css,
      loader: base.loaders.css.loader.replace('style!', 'isomorphic-style!'),
    })
  }
}

module.exports = serverConfig
