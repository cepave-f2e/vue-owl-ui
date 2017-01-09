import Icon from '~com/icon'
import Markdown from '../../components/markdown'
import s from './icon.scss'

const icons = require('@cepave/owl-icons').match(/symbol id="([^"]*)/g).map((id)=> {
  return id.match(/symbol id="([^"]*)/)[1]
})

const IconPage = {
  name: 'IconPage',
  render(h) {
    const { $slots } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />

        { icons.map((typ)=> {
          typ = typ.replace(/^owl-icons-/, '')
          return (
            <div class={[s.icons]}>
              <Icon typ={typ} size={30} />
              <p>{typ}</p>
            </div>
          )
        }) }
      </div>
    )
  }
}

module.exports = IconPage
