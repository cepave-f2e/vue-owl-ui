import delegate from 'delegate-to'
import s from './button.scss'

const Button = {
  name: 'Button',
  props: {
    status: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
    },
  },

  render(h) {
    const { status, style, fill, $slots } = this

    return (
      <button type="button" class={style} data-color="red">
        {$slots.default}
      </button>
    )
  },
}

Button.Group = {
  name: 'ButtonGroup',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      buttonOptions: this.options,
      selectedIdx: this.options.find((option) => option.selected === true),
    }
  },
  computed: {
    renderButtons() {
      const { buttonOptions } = this

      const _buttonOptions = buttonOptions.map((option, i) => {
        const dataSelected = (option.selected) ? '1' : '0'
        if (option.selected) {
          this.selectedIdx = i
        }
        return (
          <Button status="primaryOutline" data-selected={dataSelected} data-role="button">{option.title}</Button>
        )
      })
      return _buttonOptions
    },
  },
  methods: {
    _handleClickButton: delegate('[data-role="button"]', function(e) {
      const { delegateTarget } = e
      const { selectedIdx } = this
      const idx = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget)
      if (idx === selectedIdx) {
        return
      }
      this.$emit('change', {
        value: this.buttonOptions[idx].value,
        idx,
      })
      this.buttonOptions.forEach((buttonOption) => this.$set(buttonOption, 'selected', false))
      this.$set(this.buttonOptions[idx], 'selected', true)
    }),
    setOptions(newOpts) {
      this.buttonOptions = newOpts
      this.selectedIdx = newOpts.find((option) => option.selected)
    },
    setSelectedOption(value) {
      const selectedOptIdx = this.buttonOptions.findIndex((buttonOption) => {
        return buttonOption.value === value
      })
      this.$set(this.buttonOptions[this.selectedIdx], 'selected', false)
      this.$set(this.buttonOptions[selectedOptIdx], 'selected', true)
    },
  },
  render(h) {
    const { renderButtons, _handleClickButton } = this
    return (
      <div class={[s.buttonGroup]} on-click={_handleClickButton}>
        {renderButtons}
      </div>
    )
  },
}

module.exports = Button
