import s from './loading.scss'
module.exports = {
  props: {
    typ: {
      type: String,
      default: 'pie',
    },
    size: {
      type: [String, Number],
    },
    show: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    style() {
      let width, height
      let { size } = this
      const { typ, show } = this

      const style = {
        display: show ? 'block' : 'none'
      }

      switch (typ) {
      case 'pie':
        style.borderWidth = `${size}px`
        break

      case 'bar':
        size = size || '100x10'
        ;[width, height] = size.split('x')
        style.width = `${width}px`
        style.height = `${height}px`
        break
      }

      return style
    }
  },

  render(h) {
    const { style, typ } = this
    const type = `loading${typ}`
    return (
      <div class={s[type]} style={style} />
    )
  }
}
