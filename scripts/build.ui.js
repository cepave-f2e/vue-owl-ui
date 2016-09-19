import gulp from 'gulp'
import rename from 'gulp-rename'
import uglify from 'gulp-uglify'
import cleanCSS from 'gulp-clean-css'
import fs from 'fs'

gulp.src('npm/dist/*.js', { base: 'npm' })
  .pipe(uglify())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest('npm'))


gulp.src('npm/dist/*.css', { base: 'npm' })
  .pipe(cleanCSS())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest('npm'))
  .on('finish', ()=> {
    let pkg = require('../package.json')
    const { scripts, devDependencies, jest, ...packageJSON } = pkg

    fs.writeFile('npm/package.json', JSON.stringify(packageJSON, null, 2))
  })
