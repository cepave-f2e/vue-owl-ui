import '@cepave/owl-icons'
import s from './icon.scss'

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
    }
  },

  render(h) {
    const { typ, cSize } = this
    
    return (
      <svg width={cSize.width} height={cSize.height} 
        class={ 
          s[(typ === 'arrow-left') || (typ === 'arrow-right') ? typ : '']
        } 
        domProps-innerHTML={
         `<use xlink:href="#owl-icons-${(typ === 'arrow-left') || (typ === 'arrow-right') ? 'arrow-down' : typ}"></use>` 
      } />
      
    )
  }
}

module.exports = Icon
