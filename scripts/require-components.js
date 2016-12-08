import glob from 'glob'
import path from 'path'
import camelCase from 'lodash.camelcase'
import fs from 'fs'

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

module.exports = components
