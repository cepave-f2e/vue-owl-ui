import Loading from '../loading'
import Icon from '../icon'
import s from './input.scss'

const Input = {
  props: {
    name: {
      type: String,
      default: 'input',
    },
    loading:{
      type: Boolean,
      default: false,
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
    password: {
      type: Boolean,
      default: false
    },
    onIconClick: {
      type: Function
    }
  },

  data() {
    return {
      pwdStatus: true,
      pwdFill: '#8962d9',
      pwdInput: 'text'
    }
  },

  methods: {
    getInputValue() {
      const { name } = this
      const data = {
        [name] : this.$refs[name].value,
      }
      return data
    },
    handlePwdStyle(e) {
      this.pwdStatus = !this.pwdStatus
      this.pwdFill = (this.pwdStatus) ? '#8962d9' : '#B8bdbf'
      this.pwdInput = (this.pwdStatus) ? 'text' : 'password'
    }
  },

  computed: {
    value() {
      return this.getInputValue()
    },
  },

  render(h) {
    const { status, loading, icon, name, placeholder, password, onIconClick, handlePwdStyle, pwdFill, pwdInput } = this

    return (
      <div class={[s.inputWrapper]}>
        <Loading size={10} class={[s.loadingPie]} show={loading}/>
        {(icon && !loading && !password)
          ? <span><Icon typ={icon[0]} fill={icon[1]} class={[s.icon]}/></span>
          : ''
        }
        {password
          ? <span on-click={handlePwdStyle}><Icon typ="eye" fill={pwdFill} class={[s.icon]}/></span>
          : ''
        }
        <input class={[s.input, s[status]]} type={pwdInput} ref={name} placeholder={placeholder}/>
      </div>
    )
  }
}

module.exports = Input
