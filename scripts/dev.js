import webpack from 'webpack'
import clientConfig from '../webpack/client'
import { hotPort } from '../webpack/share'
import devMid from 'webpack-dev-middleware'
import hotMid from 'webpack-hot-middleware'
import express from 'express'
import c from 'chalk'

const devServer = express()

const clientPacker = webpack(clientConfig)

devServer
  .use(devMid(clientPacker, {
    stats: {
      colors: true,
      chunks: false
    },
    publicPath: clientConfig.output.publicPath
  }))
  .use(hotMid(clientPacker))
  .listen(hotPort, ()=> {
    console.log(`⚡️  Webpack dev server is listening on ${c.cyan(hotPort)}`)
  })
