import fs from 'fs'
import { createBundleRenderer } from 'vue-server-renderer'

const isProd = process.env.NODE_ENV === 'production'

const appServerPath = `${__dirname}/../../dist/app.server.js`
let appServerData

if (isProd) {
  appServerData = fs.readFileSync(appServerPath)
}

const ssr = ()=> {
  return new Promise((resolve, reject) => {
    if (appServerData) {
      resolve(createBundleRenderer(appServerData))
    } else {
      fs.readFile(appServerPath, (err, data)=> {
        if (err) reject(err)
        resolve(createBundleRenderer(data))
      })
    }
  })
}

module.exports = ssr
