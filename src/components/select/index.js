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

    onchange: {
      type: Function,
    },
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
      const { onchange, _getTitle, options, _selectedIdx } = this
      const idx = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget)

      if (idx === _selectedIdx) {
        return
      }

      this._selectedIdx = idx
      this.title = _getTitle(options[idx])
      this.value = options[idx].value
      this.opened = false

      if (onchange) {
        onchange({
          value: this.value,
          idx
        })
      }
    }),

    _getTitle(option) {
      const { optionsRender } = this
      const h = this.$createElement
      return (
        option.render
          ? option.render(h, option)
          : optionsRender
          ? optionsRender(h, option)
          : option.title
      )
    }
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
      const { options, _getTitle } = this
      const h = this.$createElement
      let hasSelected = false

      const _options = options.map((option, i) => {
        if (option.selected) {
          hasSelected = true
          this._selectedIdx = i
          this.title = _getTitle(option)
          this.value = option.value
        }

        return (
          <div data-role="select-option" data-idx={i}>
            { _getTitle(option) }
          </div>
        )
      })

      if (!hasSelected) {
        this.title = _getTitle(options[0])
        this.value = options[0].value
      }
      return _options
    }
  },

  render(h) {
    const {
      close, $slots, name, _handleOnChange,
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
