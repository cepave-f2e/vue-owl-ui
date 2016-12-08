import 'shelljs/global'
import gu from 'gulp'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import fs from 'fs'
import log from './log'
import c from 'chalk'
import size from 'gulp-size'
import requireComponents from './require-components'

rm('-rf', ['npm', 'dist'])

const exportsJS = (fs.readFileSync('src/components/index.js').toString())

const replaceExportsJS = exportsJS
  .replace('module.exports', `module.exports = ${JSON.stringify(requireComponents)}`)
  .replace(/"(require[^"]+)"/g, '$1')


fs.writeFileSync('src/components/index.js', replaceExportsJS)

exec('NODE_ENV=temp npm run pack.client')
exec('NODE_ENV=build npm run pack.client')
rm(['npm/dist/*.css'])

gu.src('npm/dist/*.js', { base: 'npm' })
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gu.dest('npm'))
  .on('finish', ()=> {
    const pkg = require('../package.json')
    const { scripts, devDependencies, jest, ...packageJSON } = pkg

    fs.writeFile('npm/package.json', JSON.stringify(packageJSON, null, 2))

    gu.src('README.md')
      .pipe(gu.dest('npm'))
      .on('finish', ()=> {
        log(`outputs to: ${c.cyan('npm/')}`)

        gu.src('npm/**')
          .pipe(size({
            showFiles: true,
            gzip: true,
            prettySize: true,
          }))

        console.log(JSON.stringify(requireComponents, null, 2))
      })
  })

fs.writeFileSync('src/components/index.js', exportsJS)
