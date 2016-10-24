import s from './switch.scss'

const SwitchButton = {
  name: 'SwitchButton',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'data'
    },
    onChange: {
      type: Function,
    }
  },
  data () {
    return {
      check: this.checked
    }
  },
  watch: {
    checked() {
      this.check = this.checked
    }
  },
  methods: {
    handleClick () {
      const { onChange, name } = this
      this.check = !this.check
      const data = {
        [name]: this.check
      }
      if (onChange) {
        onChange(data)
      }
    },
  },
  render(h) {
    const { handleClick, check } = this
    return (
      <div class={[s.wrapper]} on-click={handleClick}>
        <input type="checkbox" class={[s.switchButton]} checked={check}/>
        <div class={[s.switch]}>
          <label class={[s.toggle]}></label>
        </div>
      </div>
    )
  }
}
module.exports = SwitchButton
