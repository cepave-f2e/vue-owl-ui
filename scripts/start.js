import express from 'express'
import c from 'chalk'
const demoServer = express()

demoServer
  .use(express.static(`${__dirname}/../gh-pages`))
  .listen(3033, ()=> {
    console.log(`gh-pages demo server is listening on ${c.cyan(3033)}`)
  })
