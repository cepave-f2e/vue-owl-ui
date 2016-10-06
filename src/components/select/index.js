import delegate from 'delegate-to'
import s from './select.scss'

const Select = {
  name: 'Select',

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },

    isDisable: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      default: ''
    },

    onChange: {
      type: Function,
    },
  },

  methods: {
    close() {
      this.opened = false
    },

    toggleMenu() {
      if (this.isDisable) {
        return
      }

      this.opened = !this.opened
    },

    _handleOnChange: delegate('[data-role="select-option"]', function(ev) {
      const { delegateTarget } = ev
      const { $children, d, onChange } = this
      const idx = +delegateTarget.getAttribute('data-idx')

      if (idx === d.selectedIdx) {
        return
      }

      this.d.title = $children[idx].$slots.default
      this.d.value = $children[idx].value

      this.d.selectedIdx = idx
      this.opened = false

      onChange({
        value: $children[idx].value,
        idx
      })
    })
  },

  watch: {
    isOpen(newVal) {
      this.opened = newVal
    },
  },

  data() {
    return {
      opened: this.isOpen,
    }
  },


  mounted() {

  },

  computed: {
    d() {
      const { $slots } = this

      if (!$slots.default) return {}

      let selectedIdx = 0, selectedVNode = $slots.default[0]

      $slots.default.forEach((v, idx) => {
        if (typeof v.data.attrs === 'undefined') {
          v.data.attrs = {}
        }
        v.data.attrs['data-idx'] = idx

        if (v.componentOptions.propsData.selected) {
          selectedIdx = idx
          selectedVNode = v
        }
      })
      return {
        title: selectedVNode.componentOptions.children,
        value: selectedVNode.componentOptions.propsData.value,
        selectedIdx
      }
    },

    css() {
      const { opened, isDisable } = this
      const style = {}
      style[s.selectOpen] = opened
      style[s.disabled] = isDisable
      return style
    }
  },

  render(h) {
    const { close, $slots, name, _handleOnChange,
            toggleMenu, d, css } = this

    return (
      <div class={[s.selecter, css]} on-blur={close} tabindex="-1">
        <div class={[s.selectTitle]} on-click={toggleMenu}>
          <div class={[s.titleText]}>
            {d.title}
          </div>

          <div class={[s.titleRight]}>
            <div class={[s.arrow]}></div>
          </div>
        </div>

        <div class={[s.optionBox, css]} on-click={_handleOnChange}>
          {$slots.default}
        </div>
        <input type="hidden" name={name} value={d.value} />
      </div>
    )
  },
}

Select.Option = {
  name: 'SelectOption',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },

    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {

    }
  },

  render(h) {
    const { $slots } = this

    return (
      <div class={[]} data-role="select-option">
        {$slots.default}
      </div>
    )
  }
}

module.exports = Select
