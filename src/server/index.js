process.env.VUE_ENV = 'server'

import experss from 'express'
import renderHTML from './render-html'
import ssr from './ssr'
import c from 'chalk'

const server = experss()
const port = process.env.PORT || 3031

server
  .get('*', async(req, res)=> {
    const { url } = req
    const context = { url }

    ssr()
      .then((renderer)=> {
        renderer.renderToString(context, (err, appHTML)=> {
          if (err) {
            console.log({ err })
          }
          res.end(renderHTML({ appHTML }))
        })
      })
      .catch((err)=> {
        throw err
      })
  })
  .listen(port, ()=> {
    console.log(`🌍  Server is listening on ${c.cyan(port)}`)
  })
