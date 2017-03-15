import Icon from '../icon'
import Flex from '../flex'
import Loading from '../loading'
import Checkbox from '../checkbox'
import s from './complex-query.scss'
import escapeRegexp from 'lodash.escaperegexp'

const ComplexQuery = {
  name: 'ComplexQuery',
  props: {
    categories: {
      type: Array,
      default: () => [
        {
          name: 'cat1',
          value: 'cat1',
          on: true,
        }
      ]
    },
    placeholder: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => [
        {
          name: '',
          checked: false,
          children: [
            {
              name: '',
              value: 'uniq',
              checked: false,
            }
          ]
        }
      ]
    },
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Object,
      default() {
        return {
          selectAll: 'select all',
          clearAll: 'clear all',
          selected: 'selected',
          selectedItems: 'selected items',
          removeAll: 'remove all',
        }
      }
    }
  },

  data() {
    const { categories, items } = this

    let cat = ''
    if (categories.length) {
      cat = (categories.find(cat => cat.on) || categories[0]).value
    }

    return {
      cat,
      focus: false,
      selectedItems: {},
      storeSelectedItems: {},
      highlightText: '',
      isEdit: false,
    }
  },
  watch: {
    storeSelectedItems() {
      this.$emit('change', {
        selectedItems: this.storeSelectedItems
      })
    }
  },
  methods: {
    editRemoveAll(ev) {
      this.storeSelectedItems = {}
    },

    editItemRemove({ item }) {
      const { storeSelectedItems } = this
      return (ev) => {
        this.$delete(storeSelectedItems, item)
      }
    },

    onQuery(ev) {
      const { which } = ev
      const { $refs, cat } = this

      if (which !== 13) {
        return
      }
      this.highlightText = $refs.query.value
      this.$emit('query', {
        value: $refs.query.value,
        category: cat
      })
    },

    handleSelect({ itemIdx, itemChildIdx }) {
      const { items, $set, $delete } = this

      return (d)=> {
        const [name] = Object.keys(d)
        const checked = d[name]

        if (name === '@@dt@@') {
          items[itemIdx].checkedCounts = checked ? items[itemIdx].children.length : 0
          $set(items[itemIdx], 'checked', checked)

          items[itemIdx].children.forEach((itemChild)=> {
            $set(itemChild, 'checked', checked)

            this[checked ? '$set' : '$delete'](this.selectedItems, itemChild.value, true)

            // store
            if (checked) {
              if (!this.storeSelectedItems[itemChild.value]) {
                $set(this.storeSelectedItems, itemChild.value, {
                  ...itemChild
                })
              }
            }
          })
        } else {
          if (items[itemIdx].checkedCounts === undefined) {
            items[itemIdx].checkedCounts = 0
          }

          $set(items[itemIdx].children[itemChildIdx], 'checked', checked)
          items[itemIdx].checkedCounts += checked ? 1 : -1
          this[checked ? '$set' : '$delete'](this.selectedItems, name, true)

          if (checked) {
            if (!this.storeSelectedItems[items[itemIdx].children[itemChildIdx].value]) {
              $set(this.storeSelectedItems, items[itemIdx].children[itemChildIdx].value, {
                ...items[itemIdx].children[itemChildIdx]
              })
            }
          }
          $set(items[itemIdx], 'checked', items[itemIdx].checkedCounts >= items[itemIdx].children.length)
        }
      }
    },

    handleFocus() {
      this.focus = true
    },
    handleBlur() {
      if (this.lockBlur) {
        return
      }
      this.focus = false
    },

    handleFold(eq) {
      const { items } = this

      return (ev) => {
        this.$set(items[eq], 'isFold', !items[eq].isFold)
      }
    },
    changeCategory(eq) {
      const { categories } = this

      return (ev) => {
        categories.forEach((cat, i) => {
          if (i === eq) {
            this.cat = cat.value
          }
        })
      }
    },

    selectAll() {
      const { items, $set, totalCounts, sum } = this

      if (sum >= totalCounts) {
        return
      }

      items.forEach((item)=> {
        $set(item, 'checked', true)
        item.checkedCounts = item.children.length
        item.children.forEach((child)=> {
          $set(child, 'checked', true)
          $set(this.selectedItems, child.name, true)

          if (!this.storeSelectedItems[child.value]) {
            this.$set(this.storeSelectedItems, child.value, {
              ...child
            })
          }
        })
      })
    },

    clearAll() {
      const { items, $set, sum } = this
      if (sum === 0) {
        return
      }

      items.forEach((item)=> {
        $set(item, 'checked', false)
        item.checkedCounts = 0
        item.children.forEach((child)=> {
          $set(child, 'checked', false)
        })
      })

      this.selectedItems = {}
    },

    editItems(ev) {
      const { storeSelectedItems } = this
      this.isEdit = true
    }
  },

  computed: {
    totalCounts() {
      const { items } = this

      return items.reduce((sum, item) => {
        return sum += item.children.length
      }, 0)
    },
    sum() {
      const { selectedItems } = this
      return Object.keys(selectedItems).length
    },
    css() {
      const { focus, isEdit, items } = this
      return {
        [s.focus]: focus,
        [s.isEdit]: isEdit,
        [s.hasItems]: items.length
      }
    },
    renderCategories() {
      const { categories, changeCategory } = this
      const h = this.$createElement

      return (
        <ul class={[s.categories]}>
          {categories.map((cat, index) => {
            return (
              <li data-value={cat.value} data-on={this.cat === cat.value} onClick={changeCategory(index)}>
                {cat.name}
              </li>
            )
          }) }
        </ul>
      )
    },

    renderItems() {
      const { items, handleFold, handleSelect, $refs, highlightText } = this
      const h = this.$createElement

      return (
        <div class={[s.itemView]}>
          {items.map((item, itemIdx) => {
            const classes = {
              [s.isFold]: item.isFold
            }

            return (
              <dl class={classes}>
                <dt onClick={handleFold(itemIdx)}>
                  <Flex split>
                    <Flex.Col>
                      <Checkbox
                        checked={item.checked}
                        onChange={handleSelect({ itemIdx })}
                        data-itemidx={itemIdx}
                        name={'@@dt@@'}
                        class={[s.itemViewCheckbox]} >
                        {item.name}
                      </Checkbox>
                    </Flex.Col>
                    <Flex.Col>
                      <Icon typ="arrow-up" is-fold={item.isFold} />
                    </Flex.Col>
                  </Flex>
                </dt>
                {item.children.map((itemChild, itemChildIdx) => {
                  const hasChildren = itemChild.children && itemChild.children.length
                  let name = itemChild.name

                  if (highlightText.trim()) {
                    name = name.replace(new RegExp(`(${escapeRegexp(highlightText)})`, 'ig'), (m) => {
                      return `<span class="${s.highlight}">${m}</span>`
                    })
                  }

                  return (
                    <dd class={[s.itemdd]}>
                      <Checkbox
                        checked={itemChild.checked}
                        onChange={handleSelect({ itemIdx, itemChildIdx })}
                        name={itemChild.value} class={[s.itemViewCheckbox, s.itemCheckbox]}>
                        <div class={[s.item]} domPropsInnerHTML={name} />
                      </Checkbox>
                    </dd>
                  )
                }) }
              </dl>
            )
          }) }
        </div>
      )
    },

    renderEditItems() {
      const { storeSelectedItems, editItemRemove } = this
      const h = this.$createElement

      return (
        <ul>
          {
            Object.keys(storeSelectedItems).map((item) => {
              return (
                <li class={[s.editItemLi]} onClick={editItemRemove({ item })}>
                  <Icon typ="circle-minus" /> {storeSelectedItems[item].name}
                </li>
              )
            })
          }
        </ul>
      )
    },

    storeSUM() {
      const { storeSelectedItems, items } = this

      const sum = Object.keys(storeSelectedItems).length

      if (!sum) {
        this.isEdit = false
      }

      return sum
    }
  },
  render(h) {
    const { renderCategories, categories, handleFocus, handleBlur, css, renderItems, sum,
      selectAll, clearAll, totalCounts, text, onQuery, storeSUM, editItems, renderEditItems,
      editRemoveAll, lockBlur, loading, placeholder } = this

    return (
      <div class={[s.com, css]} onMouseup={() => this.$refs.query.focus()}
        onMouseenter={() => this.lockBlur = true}
        onMouseleave={() => this.lockBlur = false}>
        <Flex split mid>
          {
            storeSUM
              ? (
                <Flex.Col>
                  <a onClick={editItems} class={[s.selectedItems]}>{text.selectedItems} ({storeSUM})</a>
                </Flex.Col>
              )
            : <div />
          }
          <Flex.Col size="auto">
            <input type="text" ref="query" placeholder={placeholder}
              class={[s.input]} onBlur={handleBlur} onFocus={handleFocus} onKeyup={onQuery} />
          </Flex.Col>
          <Flex.Col>
            {
              loading ? <Loading size={10} class={[s.loading]} /> : null
            }
            <Icon typ="filter" size={20} class={[s.iconFilter]} />
            { renderCategories }
          </Flex.Col>
        </Flex>

        <div class={[s.items]}>
          {renderItems}
          <Flex split class={[s.selectAll]}>
            <Flex.Col>
              <a onClick={clearAll}>{text.clearAll}</a>
              <a onClick={selectAll}>{text.selectAll}</a>
            </Flex.Col>
            <Flex.Col>{text.selected}: {sum} / {totalCounts}</Flex.Col>
          </Flex>
        </div>

      <div class={[s.editItems]}>
          <div class={[s.backTo]} onClick={(ev)=>this.isEdit = false}>
            <Icon typ="fold" />
          </div>
          {renderEditItems}
          <div class={[s.editRemoveAll]} onClick={editRemoveAll}>
            <a>{text.removeAll}</a>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ComplexQuery
