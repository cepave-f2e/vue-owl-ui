import Icon from '../icon'
import Input from '../input'
import s from './dualListbox.scss'

const Dual = {}

Dual.Group = {
  name: 'DualGroup',
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedItems: {
      type: Object,
      default: () => {
        return {}
      }
    },
    onchange: {
      type: Function
    }
  },
  data() {
    return {
      listToAdd: this.items,
      listToRemove: this.selectedItems,
      highlightLeft: '',
      highlightRight: '',
      leftList: this.items,
      rightList: this.selectedItems
    }
  },
  mounted() {
    const { handleChange, handleClickOnX } = this
    this.listToAdd = Object.assign({}, this.listToAdd)
    this.listToRemove = Object.assign({}, this.listToRemove)
    this.$on('handleSingleDualListChange', handleChange)
    this.$on('handleClickOnX', handleClickOnX)
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
      if (this.onchange) {
        this.onchange(this.rightList)
      }
    },
    handleClickOnX(data) {
      if (data === 'left') {
        this.listToAdd = this.leftList
        this.highlightLeft = ''
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
      if (this.onchange) {
        this.onchange(this.rightList)
      }
    },
    handleUnselectAll() {
      const keys = Object.keys(this.listToRemove)
      keys.map((key) => {
        delete this.rightList[key]
      })
      this.leftList = Object.assign({}, this.leftList, this.listToRemove)
      this.listToAdd = Object.assign({}, this.listToAdd, this.listToRemove)
      this.listToRemove = {}
      if (this.onchange) {
        this.onchange(this.rightList)
      }
    },
    handleSearchListLeft(e) {
      if (e.charCode === 13) {
        const keys = Object.keys(this.leftList).filter((key) => {
          return this.leftList[key].includes(this.$refs.searchListToAdd.value)
        })
        this.listToAdd = keys.reduce((preVal, curVal) => {
          return Object.assign(preVal, { [curVal]: this.listToAdd[curVal] })
        }, {})
        this.highlightLeft = this.$refs.searchListToAdd.value
      }
    },
    handleSearchListRight(e) {
      if (e.charCode === 13) {
        const keys = Object.keys(this.rightList).filter((key) => {
          return this.rightList[key].includes(this.$refs.searchListToRemove.value)
        })
        this.listToRemove = keys.reduce((preVal, curVal) => {
          return Object.assign(preVal, { [curVal]: this.listToRemove[curVal] })
        }, {})
        this.highlightRight = this.$refs.searchListToRemove.value
      }
    }
  },
  render(h) {
    const { handleSelectAll, handleUnselectAll, handleSearchListLeft, handleSearchListRight, highlightLeft, highlightRight } = this
    return (
      <div class={[s.dualWrapper]}>
        <div class={[s.dual]}>
          <div on-keypress={handleSearchListLeft}>
            <Input name="left" class={[s.input]} ref="searchListToAdd" icon={['search', '#919799']} x={true} />
          </div>
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
          <div on-keypress={handleSearchListRight}>
            <Input name="right" class={[s.input]} ref="searchListToRemove" icon={['search', '#919799']} x={true} />
          </div>
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
        const highlightReg = new RegExp(`${highlight}`, 'g')
        highlightText = `<span>${name}</span>`.replace(highlightReg, `<span class="${s.highlight}">${highlight}</span>`)
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
