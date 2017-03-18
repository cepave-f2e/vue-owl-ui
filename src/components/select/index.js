import delegate from 'delegate-to'
import s from './select.scss'

const Select = {
  name: 'Select',

  props: {
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

    value(newVal) {
      this.$emit('change', {
        value: newVal
      })
    }
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
  },

  computed: {
    css() {
      const { opened, isDisabled } = this
      const style = {}
      style[s.selectOpen] = opened
      style[s.disabled] = isDisabled
      return style
    },
  },

  created() {
    this.$on('selectOption', (child) => {
      if (this.value === child.value) {
        return
      }

      this.opened = false
      this.title = child.$slots.default
      this.value = child.value
    })
  },

  mounted() {
    const { $children } = this
    const checkedChild = $children.find((child) => child.checked) || $children[0]

    this.title = checkedChild.$slots.default
    this.value = checkedChild.value
  },

  render(h) {
    const {
      close, name, $slots,
      css, toggleMenu, value, title,
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

        <div class={[s.optionBox, css]}>
          {$slots.default}
        </div>
        <input type="hidden" name={name} value={value} />
      </div>
    )
  }
}

Select.Option = {
  props: {
    value: {
      type: String,
      default: '',
    },

    checked: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    handleClick() {
      const { $parent } = this

      $parent.$emit('selectOption', this)
    }
  },

  render(h) {
    const { $slots, handleClick } = this

    return (
      <div data-role="select-option" onClick={handleClick}>
        { $slots.default }
      </div>
    )
  }
}

module.exports = Select
