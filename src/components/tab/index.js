import delegate from 'delegate-to'
import s from './tab.scss'

const Tab = {
  name: 'Tab',
  data () {
    return {
      tabs: {},
      selectedIdx: 0,
      selectedName: ''
    }
  },

  mounted() {//find selected
    const { $slots } = this
    const selectedChild = $slots.tabHead.find((slot) => slot.child.isSelected)
    this.selectedIdx = $slots.tabHead.indexOf(selectedChild)
    this.selectedName = selectedChild.child.name
    this.switchContent()
  },

  methods: {
    switchContent() {
      const { $slots, selectedIdx, selectedName } = this
      $slots.tabContent.forEach((slot) => {
        slot.child.isSelected = false
      })
      $slots.tabContent[selectedIdx].child.isSelected = true
      this.$emit('change', {
        name: selectedName,
        idx: selectedIdx
      })
    },
    clickTab: delegate('[data-role="tab-head"]', function(e) {
      const { delegateTarget } = e
      const idx = Array.from(delegateTarget.parentNode.children).indexOf(delegateTarget)

      if (idx === this.selectedIdx) {
        return
      }

      this.selectedIdx = idx
      this.selectedName = this.$slots.tabHead[idx].child.name
      this.$slots.tabHead.forEach((slot) => slot.child.selected = '0')
      this.$slots.tabHead[idx].child.selected = '1'
      this.switchContent()
    })
  },

  render(h) {
    const { $slots, clickTab } = this
    return (
      <div>
        <div class={[s.tHead]} on-click={clickTab}>
          {$slots.tabHead}
        </div>
        <div>
          {$slots.tabContent}
        </div>
      </div>
    )
  }
}

Tab.Head = {
  name: 'TabHead',
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      selected: (this.isSelected) ? '1' : '0'
    }
  },

  render(h) {
    const { $slots, selected } = this
    return (
      <div data-selected={selected} data-role="tab-head" class={[s.tHead]}>
        { $slots.default }
      </div>
    )
  }
}

Tab.Content = {
  name: 'TabContent',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      isSelected: false
    }
  },

  render(h) {
    const { $slots, isSelected } = this
    const selected = (isSelected) ? '1' : '0'
    return (
      <div data-selected={selected} data-role="tab-content">
        { $slots.default }
      </div>
    )
  }
}

module.exports = Tab
