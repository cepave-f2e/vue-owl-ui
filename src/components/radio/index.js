import Icon from '../icon'
import s from './radio.scss'

const Radio = {
  name: 'Radio',
  props: {
    on: {
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

  data() {
    return {
      active: this.on,
    }
  },
  methods: {
    handleClick(e) {
      e.stopPropagation()
      const { $parent, active, onChange, name } = this

      $parent.$children.forEach((child) => child.active = false)
      this.active = true

      const data = {
        [name]: this.active
      }
      if (onChange) {
        onChange(data)
      }
      $parent.$emit('handleSingleRadioChange', data)
    }
  },

  watch: {
    on(newVal) {
      const { $parent, active, name } = this
      $parent.$children.forEach((child) => child.active = false)
      this.active = newVal
      $parent.$emit('handleSingleRadioChange', { [name]: newVal })
    }
  },

  render(h) {
    const { active, handleClick, $slots } = this
    return (
      <div on-click={handleClick} class={[s.radio]}>
       {
         active
         ? <Icon typ="radio-on" fill="#6c7173"/>
         : <Icon typ="radio" fill="#b0b0b0" data-radio/>
       }
        {$slots.default}
      </div>
    )
  }
}

Radio.Group = {
  name: 'RadioGroup',
  props: {
    onChange: {
      type: Function,
    },
  },

  data() {
    return {
      radioData: {},
    }
  },

  methods: {
    radioGroupOnChange(data) {
      this._radioData[this._on] = false
      this._on = Object.keys(data)[0]

      if (this.onChange) {
        this.onChange({ ...this._radioData, ...data })
      }
    },
  },

  mounted() {
    this._radioData = {}

    const getReduceData = () => {
      return this.$children.reduce((data, child) => {
        const { name, on } = child
        data[name] = on
        if (on) {
          this._on = name
        }
        return data
      }, {})
    }

    this._radioData = getReduceData()

    this.$on('handleSingleRadioChange', (data) => {
      this.radioGroupOnChange(data)
    })
  },

  render(h) {
    const { $slots } = this

    return (
      <div class={[s.raGroup]}>
        {$slots.default}
      </div>
    )
  }
}

module.exports = Radio
