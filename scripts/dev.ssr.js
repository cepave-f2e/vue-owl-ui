import './dev'
import webpack from 'webpack'
import serverConfig from '../webpack/server'

webpack(serverConfig, (err, stats)=> {
  console.log(stats.toString({
    colors: true,
    chunks: false
  }))
})

require('piping')({ main: './src/server', hook:true })
