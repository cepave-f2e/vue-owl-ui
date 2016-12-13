import Icon from '../icon'
import Input from '../input'
import s from './dual-list.scss'

const Dual = {}

Dual.Group = {
  name: 'DualGroup',
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
    this.leftList = this.listToAdd = this.items.reduce((preVal, curVal, idx) => {
      return Object.assign(preVal, { [idx]: curVal })
    }, {})
    const leftNum = this.items.length
    this.rightList = this.listToRemove = this.selectedItems.reduce((preVal, curVal, idx) => {
      return Object.assign(preVal, { [idx+leftNum]: curVal })
    }, {})
    this.$on('handleSingleDualListChange', handleChange)
    this.$on('handleClickOnX', handleClickOnX)
  },
  watch: {
    items() {
      this.leftList = this.listToAdd = this.items.reduce((preVal, curVal, idx) => {
        return Object.assign(preVal, { [idx]: curVal })
      }, {})
    }
  },
  methods: {
    handleChange(list) {
      if (list[0] === 'add') {
        delete this.leftList[list[2]]
        this.$set(this.rightList, list[2], list[1])
        delete this.listToAdd[list[2]]
        this.$set(this.listToRemove, list[2], list[1])
      } else if (list[0] === 'remove') {
        delete this.rightList[list[2]]
        this.$set(this.leftList, list[2], list[1])
        delete this.listToRemove[list[2]]
        this.$set(this.listToAdd, list[2], list[1])
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
      this.rightList = Object.assign({}, this.rightList, this.listToAdd)
      this.listToRemove = Object.assign({}, this.listToRemove, this.listToAdd)
      this.listToAdd = {}
      this.$emit('change', this.rightList)
    },
    handleUnselectAll() {
      const keys = Object.keys(this.listToRemove)
      keys.map((key) => {
        delete this.rightList[key]
      })
      this.leftList = Object.assign({}, this.leftList, this.listToRemove)
      this.listToAdd = Object.assign({}, this.listToAdd, this.listToRemove)
      this.listToRemove = {}
      this.$emit('change', this.rightList)
    },
    handleSearchListLeft(e) {
      const { apiMode } = this
      if (e.charCode === 13) {
        if (apiMode) {
          this.$emit('inputchange', this.$refs.searchListToAdd.value)
        } else {
          const keys = Object.keys(this.leftList).filter((key) => {
            return this.leftList[key].toLowerCase().includes(this.$refs.searchListToAdd.value.toLowerCase())
          })
          this.listToAdd = keys.reduce((preVal, curVal) => {
            return Object.assign(preVal, { [curVal]: this.leftList[curVal] })
          }, {})
          this.highlightLeft = this.$refs.searchListToAdd.value
        }
      }
    },
    handleSearchListRight(e) {
      if (e.charCode === 13) {
        const keys = Object.keys(this.rightList).filter((key) => {
          return this.rightList[key].toLowerCase().includes(this.$refs.searchListToRemove.value.toLowerCase())
        })
        this.listToRemove = keys.reduce((preVal, curVal) => {
          return Object.assign(preVal, { [curVal]: this.rightList[curVal] })
        }, {})
        this.highlightRight = this.$refs.searchListToRemove.value
      }
    }
  },
  render(h) {
    const { handleSelectAll, handleUnselectAll, handleSearchListLeft, handleSearchListRight, highlightLeft, highlightRight, leftLoading } = this
    return (
      <div class={[s.dualWrapper]}>
        <div class={[s.dual]}>
          <Input nativeOn-keypress={handleSearchListLeft} name="left" class={[s.input]} ref="searchListToAdd" icon={['search', '#919799']} x={true} loading={leftLoading} />
          <div class={[s.lists]}>
            {
              Object.keys(this.listToAdd).map((label) => {
                return <Dual.List id={label} name={this.listToAdd[label]} highlight={highlightLeft} icon={['circle-add', '#b9e617']} />
              })
            }
          </div>
        </div>
        <div class={[s.arrow]}>
          <span on-click={handleSelectAll}>
            <Icon class={[s.doubleRight]} typ="double-right" size={20} fill="#b8bdbf" />
          </span>
          <span on-click={handleUnselectAll}>
            <Icon class={[s.doubleLeft]} typ="double-left" size={20} fill="#b8bdbf" />
          </span>
        </div>
        <div class={[s.dual]}>
          <Input nativeOn-keypress={handleSearchListRight} name="right" class={[s.input]} ref="searchListToRemove" icon={['search', '#919799']} x={true} />
          <div class={[s.lists]}>
            {
              Object.keys(this.listToRemove).map((label) => {
                return <Dual.List id={label} name={this.listToRemove[label]} highlight={highlightRight} icon={['circle-minus', '#e6175c']} />
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

Dual.List = {
  name: 'DualList',
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
        highlightText = `<span>${name}</span>`.replace(highlightReg, (replacement) => {
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

module.exports = Dual
