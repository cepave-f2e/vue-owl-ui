process.env.VUE_ENV = 'server'

import webpack from 'webpack'
import base from './client'
import { loaders } from './share'
const serverModuleLoaders = Array.from(base.module.loaders)
const cssLoaderIdx = base.module.loaders.indexOf(loaders.css)
serverModuleLoaders.splice(cssLoaderIdx, 1)

const serverConfig = {
  ...base,
  target: 'node',
  devtool: false,
  entry: './src/server/entry',
  output: {
    ...base.output,
    libraryTarget: 'commonjs2',
    filename: 'app.server.js'
  },
  externals: base.entry.lib,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VUE_ENV: JSON.stringify('server')
      },
    })
  ],
  module: {
    rules: [...serverModuleLoaders, {
      ...loaders.css,
      use: ['isomorphic-style', ...loaders.css.use.slice(1)],
    }]
  }
}

module.exports = serverConfig
