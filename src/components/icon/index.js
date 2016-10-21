import 'owl-icons'

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
      <svg width={cSize.width} height={cSize.height} domProps-innerHTML={
        `<use xlink:href="#owl-icons-${typ}"></use>`
      } />
    )
  }
}

module.exports = Icon
