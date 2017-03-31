import delegate from 'delegate-to'
import s from './select.scss'

const Select = {
  name: 'Select',

  props: {
    options: {
      type: Array,
      required: true,
    },

    optionsRender: {
      type: Function
    },

    isOpened: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      default: ''
    },

    nameKey: {
      type: String,
      default: 'title'
    },

    valueKey: {
      type: String,
      default: 'value',
    }
  },

  data() {
    this._selectedIdx = 0

    return {
      opened: this.isOpened,
      value: '',
      title: [],
    }
  },

  watch: {
    isOpened(newVal) {
      this.opened = newVal
    },
  },

  methods: {
    close() {
      this.opened = false
    },

    toggleMenu() {
      if (this.isDisabled) {
        return
      }

      this.opened = !this.opened
    },

    _handleOnChange: delegate('[data-role="select-option"]', function (ev) {
      const { delegateTarget } = ev
      const { options, _selectedIdx, renderOptions, nameKey, valueKey } = this
      const index = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget)

      if (index === _selectedIdx) {
        return
      }

      this._selectedIdx = index
      this.title = options[index][nameKey]
      this.value = options[index][valueKey || nameKey]
      this.opened = false

      this.$emit('change', {
        value: this.value,
        index
      })
    })
  },

  computed: {
    css() {
      const { opened, isDisabled } = this
      const style = {}
      style[s.selectOpen] = opened
      style[s.disabled] = isDisabled
      return style
    },

    renderOptions() {
      const { options, optionsRender, nameKey, valueKey } = this

      const _options = options.map((option, index) => {
        if (option.selected) {
          this._selectedIdx = index
        }

        return (
          <div data-role="select-option" data-idx={index}>
            {optionsRender ? optionsRender({ option, index }) : option[nameKey]}
          </div>
        )
      })

      if (options[this._selectedIdx]) {
        this.title = options[this._selectedIdx][nameKey]
        this.value = options[this._selectedIdx][valueKey || nameKey]
      }

      return _options
    }
  },

  render(h) {
    const {
      close, name, _handleOnChange,
      renderOptions, css, toggleMenu, value, title,
    } = this

    return (
      <div class={[s.selecter, css]} on-blur={close} tabindex="-1">
        <div class={[s.selectTitle]} on-click={toggleMenu}>
          <div class={[s.titleText]}>
            {title}
          </div>

          <div class={[s.titleRight]}>
            <div class={[s.arrow]} />
          </div>
        </div>

        <div class={[s.optionBox, css]} on-click={_handleOnChange}>
          {renderOptions}
        </div>
        <input type="hidden" name={name} value={value} />
      </div>
    )
  }
}

module.exports = Select
