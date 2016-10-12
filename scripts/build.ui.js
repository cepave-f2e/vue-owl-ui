import { exec, spawn } from 'child_process'
import del from 'del'
import gu from 'gulp'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import cleanCSS from 'gulp-clean-css'
import fs from 'fs'
import log from './log'
import c from 'chalk'
import size from 'gulp-size'

del.sync(['npm', 'dist'])

exec('NODE_ENV=temp npm run pack.client', (err, stdo)=> {
  console.log(stdo)

  exec('NODE_ENV=build npm run pack.client', (err, stdo)=> {
    console.log(stdo)
    del.sync(['npm/dist/*.css'])
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
          })
      })
  })
})

