import s from './button.scss'

const Button = {
  name: 'Button',
  props: {
    status: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    style() {
      const { status, disabled } = this
      const style = [s.button]
      if (status) {
        style.push(s[status])
      }
      if (disabled) {
        style.push(s.disabled)
      }
      return style
    }
  },

  render(h) {
    const { status, style, fill, $slots } = this

    return (
      <button type="button" class={style}>
        {$slots.default}
      </button>
    )
  }
}

module.exports = Button
