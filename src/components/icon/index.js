import '@cepave/owl-icons'
import s from './icon.scss'

const direction = {
  'arrow-left': 'arrow-down', 
  'arrow-right': 'arrow-down'
}

const Icon = {
  name: 'Icon',

  props: {
    typ: {
      default: '',
      required: true,
      type: String,
    },

    size: {
      type: [String, Number],
      default: '20x20'
    },
  },

  computed: {
    cSize() {
      const { size } = this
      let width, height

      if (size.includes && size.includes('x')) {
        ;[width, height] = size.split('x')
      } else {
        width = height = size
      }

      return {
        width, height
      }
    }, 
    rotate() {
      const { typ } = this
      return direction[typ] || typ
    }
  },

  render(h) {
    const { typ, cSize } = this

    return (
      <svg width={cSize.width} height={cSize.height} 
        class={s[typ]} 
        domProps-innerHTML={
         `<use xlink:href="#owl-icons-${this.rotate}"></use>` 
      } /> 
    )
  }
}

module.exports = Icon
