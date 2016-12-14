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
      const { _getTitle, options, _selectedIdx } = this
      const index = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget)

      if (index === _selectedIdx) {
        return
      }

      this._selectedIdx = index
      this.title = _getTitle({ option: options[index] })
      this.value = options[index].value
      this.opened = false

      this.$emit('change', {
        value: this.value,
        index
      })
    }),

    _getTitle({ option, index }) {
      const { optionsRender } = this

      return (
        optionsRender
          ? optionsRender({ option, index })
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

      const _options = options.map((option, index) => {
        if (option.selected) {
          hasSelected = true
          this._selectedIdx = index
          this.title = _getTitle({ option })
          this.value = option.value
        }

        return (
          <div data-role="select-option" data-idx={index}>
            { _getTitle({ option, index }) }
          </div>
        )
      })

      if (!hasSelected) {
        this.title = _getTitle({ option: options[0] })
        this.value = options[0].value
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
