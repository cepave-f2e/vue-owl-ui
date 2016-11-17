import s from './label.scss'

const Label = {
  name: 'Label',
  props: {
    typ: {
      type: String,
      default: ''//label, outline, tag
    },
    status: {
      type: String,
      default: ''//default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      const { status, typ, badge } = this
      const style = [s.label]
      if (typ) {
        style.push(s[typ])
      }
      if (status) {
        style.push(s[`${status}${typ}`])
      }
      if (badge) {
        style.push(s.badge)
      }
      return style
    }
  },
  render(h) {
    const { $slots, style } = this
    return (
      <div class={style}>
        {$slots.default}
      </div>
    )
  }
}

module.exports = Label
