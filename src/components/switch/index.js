import s from './switch.scss'

const Switch = {
  name: 'Switch',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: 'data',
    },
    typ: {
      type: String,
      default: 'default', //or 'special'
    },
  },
  data () {
    return {
      check: this.checked,
    }
  },
  watch: {
    checked() {
      this.check = this.checked
    },
  },
  methods: {
    handleClick () {
      const { name } = this
      this.check = !this.check
      const data = {
        [name]: this.check,
      }
      this.$emit('change', data)
    },
  },
  computed: {
    style() {
      const { typ } = this
      const style = {
        checkbox: [s[`${typ}SwitchButton`]],
        div: [s[`${typ}Switch`]],
      }
      return style
    },
  },
  render(h) {
    const { handleClick, check, $slots, style } = this
    return (
      <div class={[s.wrapper]} on-click={handleClick}>
        <input type="checkbox" class={style.checkbox} checked={check} />
        <div class={style.div}>
          <label class={[s.toggle]}></label>
          {$slots.default}
        </div>
      </div>
    )
  },
}

Switch.Open = {
  name: 'SwitchOpen',
  render(h) {
    const { $slots } = this
    return (
      <span class={[s.labelOpen]}>{$slots.default}</span>
    )
  },
}

Switch.Close = {
  name: 'SwitchClose',
  render(h) {
    const { $slots } = this
    return (
      <span class={[s.labelClose]}>{$slots.default}</span>
    )
  },
}
module.exports = Switch
