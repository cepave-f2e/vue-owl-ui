import MarkItDown from 'mark-it-down'
import $ from 'cash-dom'
import s from './markdown.scss'
import Clipboard from 'clipboard'
import escape from 'lodash.escape'

const Markdown = {
  name: 'Markdown',
  props: {
    src: {
      type: String,
      default: '',
    },
    opts: {},
  },

  created() {
    const { opts } = this

    this.md = new MarkItDown({
      hasHeadHash: false,
      ...opts,
    })
  },

  mounted() {
    const { md, $el, $refs } = this
    md.mountToTextArea($refs.textarea)

    const cpSvg = `<svg width="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1528"><path d="M917.980361 1009.145687H434.961416c-37.918611 0-68.768223-30.845519-68.768223-68.75799v-60.047608H112.948445c-37.918611 0-68.768223-30.844495-68.768223-68.756966V135.336338c0-37.913495 30.848589-68.75799 68.768223-68.75799h547.421744c37.919634 0 68.768223 30.844495 68.768223 68.75799v154.199964a111.745037 111.745037 0 0 1 12.106736 10.44591l205.293643 205.304899c22.920012 22.907733 40.20877 64.60132 40.20877 96.978729v338.12288c0 37.912471-30.848589 68.756967-68.7672 68.756967zM406.036643 839.407841h1.088798v100.979856c0 15.343453 12.487406 27.825742 27.835975 27.825742h483.018945c15.34857 0 27.834952-12.482289 27.834952-27.825742V622.73094H765.226329c-37.918611 0-68.7672-30.845519-68.7672-68.75799V346.701257H406.036643v492.706584zM112.948445 107.510596c-15.34857 0-27.835975 12.482289-27.835975 27.825742v676.246785c0 15.34243 12.487406 27.824719 27.835975 27.824718h252.15595V305.769009h323.101769V135.336338c0-15.343453-12.487406-27.825742-27.835975-27.825742H112.948445zM737.391377 354.015849v199.957101c0 15.343453 12.486382 27.825742 27.834952 27.825742h177.615256c-4.679579-17.781992-14.360056-36.68962-25.241894-47.564295L737.391377 354.015849zM563.767014 236.31517H209.552643v-40.932248h354.213348v40.932248z" fill="#3E3A39" p-id="1529"></path></svg> `
    $($el).find('.mark-it-down pre').each((pre) => {
      const copy = document.createElement('div')
      copy.appendChild(pre.cloneNode(true))
      copy.classList.add(s.cp)

      $(copy).append(`<div class="${s.cpBoard}" data-clipboard-text="${escape(pre.textContent)}"> ${cpSvg}</div> `)
      pre.parentNode.replaceChild(copy, pre)
    })

    $($el).find(`.mark-it-down .${s.cp}`)
      .on('mouseleave', (ev) => {
        const { currentTarget } = ev
        currentTarget.querySelector(`.${s.cpBoard}`).innerHTML = cpSvg
      })

    new Clipboard(`.${s.cpBoard}`)
      .on('success', (ev) => {
        const { trigger } = ev
        trigger.innerHTML = 'Copied'
      })
  },

  render(h) {
    const { src } = this

    return (
      <div data-markdown>
        <textarea ref="textarea" hidden>{src}</textarea>
      </div>
    )
  },
}

module.exports = Markdown
