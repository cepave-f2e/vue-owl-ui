import Loading from '../loading'
import Icon from '../icon'
import s from './input.scss'

const Input = {
  props: {
    name: {
      type: String,
      default: 'input',
    },
    icon: {
      type: Array,
    },
    status: {
      type: String,
      default: 'normal'
    },
    placeholder: {
      type: String,
      default: ''
    },
    loading:{
      type: Boolean,
      default: false,
    },
    password: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      pwdStatus: this.password,
      pwdFill: '#b8bdbf',
      pwdInput: this.password ? 'password' : 'text',
      showX: false,
      value: '',
    }
  },

  methods: {
    handleIconClick(e) {
      const { icon, name } = this
      this.value = this.$refs[name].value = ''
      this.$parent.$emit('handleClickOnX', name)
      this.showX = false
    },
    handleInput(e) {
      const { name, x } = this
      this.value = this.$refs[name].value
      this.showX = (x && this.value) ? true : false
    },
    handlePwdStyle(e) {
      this.pwdStatus = !this.pwdStatus
      this.pwdFill = (this.pwdStatus) ? '#b8bdbf' : '#8962d9'
      this.pwdInput = (this.pwdStatus) ? 'password' : 'text'
    }
  },

  render(h) {
    const { status, icon, name, placeholder, password, loading, handlePwdStyle, pwdFill, pwdInput, x, showX, handleInput, handleIconClick } = this

    return (
      <div class={[s.inputWrapper]}>
        <Loading size={10} class={[s.loadingPie]} show={loading} />
        {(icon && !loading && !password && !showX)
          ? <Icon typ={icon[0]} fill={icon[1]} class={[s.icon]} />
          : ''
        }
        {password
          ? <span on-click={handlePwdStyle}><Icon typ="eye" fill={pwdFill} class={[s.icon]} /></span>
          : ''
        }
        {showX
          ? <span on-click={handleIconClick}><Icon typ="x" fill={pwdFill} class={[s.icon]} /></span>
          : ''
        }
        <input class={[s.input, s[status]]} type={pwdInput} ref={name} placeholder={placeholder} on-input={handleInput} />
      </div>
    )
  }
}

module.exports = Input
