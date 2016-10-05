import gu from 'gulp'
import svgstore from 'gulp-svgstore'
import cheerio from 'gulp-cheerio'
import svgmin from 'gulp-svgmin'
import rename from 'gulp-rename'
import notify from 'gulp-notify'
import log from './log'
import c from 'chalk'

gu.src('icons/*.svg')
  .pipe(notify((file)=> {
    log(`processing: ${c.cyan(file.relative)}`)
  }))
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(cheerio(($)=> {
    $('svg')
      .css('display',  'none')
      .find('>defs').remove()

    $('symbol').each((index, el) => {
      const $el = $(el)
      let id = $el.attr('id')

      if (/^icon-/.test(id)) {
        id = id.replace(/^icon-/, '')
        $el.attr('id', id)
        $el.find('[fill]').removeAttr('fill')
      }

      $el.find('title').remove()
    })
  }))
  .pipe(rename('owl-ui.svg'))
  .pipe(gu.dest('dist'))
  .pipe(notify((file)=> {
    log(`outputs: ${c.cyan(file.path)}`)
  }))

