process.env.VUE_ENV = 'server'

import webpack from 'webpack'
import base from './webpack.config'

const serverModuleLoaders = Array.from(base.module.loaders)
const cssLoaderIdx = base.module.loaders.indexOf(base.loaders.css)
serverModuleLoaders.splice(cssLoaderIdx, 1)

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
  externals: [
    ...Object.keys(require('./package.json').dependencies),
    'vue-router',
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VUE_ENV: JSON.stringify('server')
      },
    })
  ],
  module: {
    loaders: [...serverModuleLoaders, {
      ...base.loaders.css,
      loaders: ['isomorphic-style', ...base.loaders.css.loaders.slice(1)],
    }]
  }
}

module.exports = serverConfig
