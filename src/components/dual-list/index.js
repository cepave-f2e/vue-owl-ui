import Icon from '../icon'
import Input from '../input'
import s from './dual-list.scss'

const DualList = {
  name: 'DualList',
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedItems: {
      type: Array,
      default: () => {
        return []
      }
    },
    displayKey: {
      type: String,
      required: true
    },
    caseInsensitive: {
      type: Boolean,
      default: false
    },
    apiMode: {
      type: Boolean,
      default: false
    },
    leftLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listToAdd: {},
      listToRemove: {},
      highlightLeft: '',
      highlightRight: '',
      leftList: {},
      rightList: {}
    }
  },
  mounted() {
    const { handleChange, handleClickOnX } = this
    const items = this.items.reduce((preVal, curVal, idx) => {
      return { ...preVal, [idx]: curVal }
    }, {})
    this.listToAdd = { ...items }
    this.leftList = { ...items }

    const leftNum = this.items.length
    const selectedItems = this.selectedItems.reduce((preVal, curVal, idx) => {
      return { ...preVal, [idx+leftNum]: curVal }
    }, {})
    this.rightList = { ...selectedItems }
    this.listToRemove = { ...selectedItems }
    this.$on('handleSingleDualListChange', handleChange)
    this.$on('handleClickOnX', handleClickOnX)
  },
  watch: {
    items() {
      const items = this.items.reduce((preVal, curVal, idx) => {
        return { ...preVal, [idx]: curVal }
      }, {})
      this.listToAdd = { ...items }
      this.leftList = { ...items }
    },
    selectedItems() {
      const leftNum = this.items.length
      const selectedItems = this.selectedItems.reduce((preVal, curVal, idx) => {
        return { ...preVal, [idx+leftNum]: curVal }
      }, {})
      this.listToRemove = { ...selectedItems }
      this.rightList = { ...selectedItems }
    }
  },
  methods: {
    handleChange(list) {
      if (list[0] === 'add') {
        const shiftItem = this.leftList[list[2]]
        delete this.leftList[list[2]]
        this.rightList = { ...this.rightList, [list[2]]: shiftItem }
        delete this.listToAdd[list[2]]
        this.listToRemove = { ...this.listToRemove, [list[2]]: shiftItem }
      } else if (list[0] === 'remove') {
        const shiftItem = this.rightList[list[2]]
        delete this.rightList[list[2]]
        this.leftList = { ...this.leftList, [list[2]]: shiftItem }
        delete this.listToRemove[list[2]]
        this.listToAdd = { ...this.listToAdd, [list[2]]: shiftItem }
      }
      this.$emit('change', this.rightList)
    },
    handleClickOnX(data) {
      if (data === 'left') {
        const { apiMode } = this
        if (apiMode) {
          this.$emit('remove')
        } else {
          this.listToAdd = this.leftList
          this.highlightLeft = ''
        }
      } else if (data === 'right') {
        this.listToRemove = this.rightList
        this.highlightRight = ''
      }
    },
    handleSelectAll() {
      const keys = Object.keys(this.listToAdd)
      keys.map((key) => {
        delete this.leftList[key]
      })
      this.rightList = { ...this.rightList, ...this.listToAdd }
      this.listToRemove = { ...this.listToRemove, ...this.listToAdd }
      this.listToAdd = {}
      this.$emit('change', this.rightList)
    },
    handleUnselectAll() {
      const keys = Object.keys(this.listToRemove)
      keys.map((key) => {
        delete this.rightList[key]
      })
      this.leftList = { ...this.leftList, ...this.listToRemove }
      this.listToAdd = { ...this.listToAdd, ...this.listToRemove }
      this.listToRemove = {}
      this.$emit('change', this.rightList)
    },
    handleSearchListLeft(e) {
      const { apiMode, caseInsensitive, displayKey } = this
      if (e.charCode === 13) {
        if (apiMode) {
          this.$emit('inputchange', this.$refs.searchListToAdd.value)
        } else {
          const keys = (caseInsensitive)
          ? Object.keys(this.leftList).filter((key) => {
            return this.leftList[key][displayKey].toLowerCase().includes(this.$refs.searchListToAdd.value.toLowerCase())
          })
          : Object.keys(this.leftList).filter((key) => {
            return this.leftList[key][displayKey].includes(this.$refs.searchListToAdd.value)
          })

          this.listToAdd = keys.reduce((preVal, curVal) => {
            return { ...preVal, [curVal]: this.leftList[curVal] }
          }, {})
          this.highlightLeft = this.$refs.searchListToAdd.value
        }
      }
    },
    handleSearchListRight(e) {
      if (e.charCode === 13) {
        const { caseInsensitive, displayKey } = this
        const keys = (caseInsensitive)
        ? Object.keys(this.rightList).filter((key) => {
          return this.rightList[key][displayKey].toLowerCase().includes(this.$refs.searchListToRemove.value.toLowerCase())
        })
        : Object.keys(this.rightList).filter((key) => {
          return this.rightList[key][displayKey].includes(this.$refs.searchListToRemove.value)
        })
        this.listToRemove = keys.reduce((preVal, curVal) => {
          return { ...preVal, [curVal]: this.rightList[curVal] }
        }, {})
        this.highlightRight = this.$refs.searchListToRemove.value
      }
    }
  },
  render(h) {
    const { handleSelectAll, handleUnselectAll, handleSearchListLeft, handleSearchListRight, highlightLeft, highlightRight, leftLoading, displayKey } = this
    return (
      <div class={[s.dualWrapper]}>
        <div class={[s.dual]}>
          <Input nativeOn-keypress={handleSearchListLeft} name="left" class={[s.input]} ref="searchListToAdd" icon={['search', '#919799']} x={true} loading={leftLoading} />
          <div class={[s.lists]}>
            {
              Object.keys(this.listToAdd).map((label) => {
                return <List id={label} name={this.listToAdd[label][displayKey]} highlight={highlightLeft} icon={['circle-add', '#b9e617']} />
              })
            }
          </div>
        </div>
        <div class={[s.arrow]}>
          <Icon nativeOn-click={handleSelectAll} class={[s.doubleRight]} typ="double-right" size={20} fill="#b8bdbf" />
          <Icon nativeOn-click={handleUnselectAll} class={[s.doubleLeft]} typ="double-left" size={20} fill="#b8bdbf" />
        </div>
        <div class={[s.dual]}>
          <Input nativeOn-keypress={handleSearchListRight} name="right" class={[s.input]} ref="searchListToRemove" icon={['search', '#919799']} x={true} />
          <div class={[s.lists]}>
            {
              Object.keys(this.listToRemove).map((label) => {
                return <List id={label} name={this.listToRemove[label][displayKey]} highlight={highlightRight} icon={['circle-minus', '#e6175c']} />
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const List = {
  name: 'List',
  props: {
    highlight: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: Array,
      default: ['circle-add', '#b9e617']
    }
  },

  computed: {
    highlightText() {
      const { highlight, name } = this
      let highlightText = ''
      if (highlight) {
        const highlightReg = new RegExp(`${highlight}`, 'gi')
        highlightText = `${name}`.replace(highlightReg, (replacement) => {
          return `<span class="${s.highlight}">${replacement}</span>`
        })
      }
      return highlightText
    }
  },

  methods: {
    handleClick() {
      const { $parent, name, id } = this
      const manipulation = (this.icon[0] === 'circle-add') ? 'add' : 'remove'
      const data = [manipulation, name, id]
      $parent.$emit('handleSingleDualListChange', data)
    },
  },

  render(h) {
    const { name, icon, highlight, handleClick, highlightText } = this
    return (
      <div class={[s.listWrapper]} on-click={handleClick}>
        {highlight
          ? <span class={[s.list]} domProps-innerHTML={highlightText}></span>
          : <span class={[s.list]} domProps-innerHTML={name}></span>
        }
        <Icon class={[s.icon]} typ={icon[0]} size={18} fill={icon[1]} />
      </div>
    )
  }
}

module.exports = DualList
