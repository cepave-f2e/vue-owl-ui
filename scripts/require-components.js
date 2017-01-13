import glob from 'glob'
import path from 'path'
import camelCase from 'lodash.camelcase'
import fs from 'fs'
import alias from './require-components-alias'

const components = {}

glob.sync('src/components/*').forEach((file) => {
  if (!fs.statSync(file).isDirectory()) {
    return
  }

  const basename = path.basename(file)
  const ComName = (camelCase(basename)).replace(/^\w/, (m) => {
    return m.toUpperCase()
  })
  components[ComName] = `require('./${basename}')`
})

Object.keys(alias).forEach((name) => {
  components[name] = components[alias[name]]
})

module.exports = components
