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
      default: ''
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
  methods: {
    handleClick () {
      const { onChange } = this
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
      <div class={[s.wrapper]}>
        <input type="checkbox" class={[s.switchButton]} checked={check}/>
        <div class={[s.switch]}>
          <label class={[s._toggle]} on-click={handleClick}></label>
        </div>
      </div>
    )
  }
}
module.exports = SwitchButton
