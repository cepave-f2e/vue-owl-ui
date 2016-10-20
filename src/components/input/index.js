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

  methods: {
    getInputValue() {
      const { name } = this
      const data = {
        [name] : this.$refs[name].value,
      }
      return data
    }
  },

  computed: {
    value() {
      return this.getInputValue()
    }
  },

  render(h) {
    const { status, loading, icon, name, placeholder, password, onIconClick } = this
    return (
      <div class={[s.inputWrapper]}>
        <Loading size={10} class={[s.loadingPie]} show={loading}/>
        <span>
          {(icon && !loading && !password)
            ? <Icon typ={icon[0]} fill={icon[1]} class={[s.icon]}/>
            : ''
          }
        </span>
        {password
          ? <Icon typ="eye" fill="#8962d9" class={[s.icon]}/>
          : ''
        }
        <input class={[s.input, s[status]]} ref={name} placeholder={placeholder}/>
      </div>
    )
  }
}

module.exports = Input
