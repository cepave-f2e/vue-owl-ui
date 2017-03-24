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
    val: {
      type: [String, Number],
      default: ''
    },
    defaultValue: {
      default: ''
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
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
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
      value: this.defaultValue,
    }
  },

  watch: {
    value(val) {
      this.$emit('input', val)
    }
  },

  computed: {
    styles() {
      const { status, disabled } = this
      const styles = [
        s.input, s[status], {
          [s.disabled]: disabled
        }
      ]
      return styles
    }
  },

  methods: {
    setValue(value) {
      this.value = value
    },
    handleIconClick(e) {
      const { icon, name } = this
      this.value = this.$refs[name].value = ''
      this.$parent.$emit('handleClickOnX', name)
      this.showX = false
    },
    handleInput(e) {
      const { name, x } = this
      this.value = this.$refs[name].value
      this.showX = (x && this.value && !this.loading) ? true : false
    },
    handlePwdStyle(e) {
      this.pwdStatus = !this.pwdStatus
      this.pwdFill = (this.pwdStatus) ? '#b8bdbf' : '#8962d9'
      this.pwdInput = (this.pwdStatus) ? 'password' : 'text'
    }
  },

  render(h) {
    const { value, styles, icon, name, placeholder, val, password, loading, disabled, handlePwdStyle, pwdFill, pwdInput, showX, required, handleInput, handleIconClick } = this

    return (
      <div class={[s.inputWrapper]}>
        <Loading size={10} class={[s.loadingPie]} show={loading} />
        {(icon && !loading && !password && !showX)
          ? <Icon typ={icon[0]} fill={icon[1]} class={[s.icon]} />
          : ''
        }
        {password
          ? <span on-click={handlePwdStyle}><Icon typ="eye" fill={pwdFill} class={[s.specialIcon]} /></span>
          : ''
        }
        {showX
          ? <span on-click={handleIconClick}><Icon typ="x" fill={pwdFill} class={[s.specialIcon]} /></span>
          : ''
        }
        {required
          ? <span class={[s.mustFill]}>*</span>
          : ''
        }
        <input class={styles} type={pwdInput} ref={name} placeholder={placeholder} domPropsValue={value} on-input={handleInput} disabled={disabled} />
      </div>
    )
  }
}

module.exports = Input
