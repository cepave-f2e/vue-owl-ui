import Icon from '../icon'
import s from './checkbox.scss'

const Checkbox = {
  name: 'Checkbox',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      check: this.checked,
    }
  },

  methods: {
    handleClick(e) {
      e.stopPropagation()
      const { $parent, name } = this
      this.check = !this.check

      const data = {
        [name]: this.check,
      }

      this.$emit('change', data)

      $parent.$emit('handleSingleCheckboxChange', data)
    },
  },

  watch: {
    checked(newVal) {
      const { $parent, name } = this
      this.check = newVal

      $parent.$emit('handleSingleCheckboxChange', { [name]: newVal })
    },
  },

  render(h) {
    const { handleClick, check,  $slots } = this

    return (
      <div on-click={handleClick} class={[s.cb]}>
        {check
          ? <Icon typ="checked" />
          : <Icon typ="checkbox" fill="#fff" />
        }
        {$slots.default}
      </div>
    )
  },
}

Checkbox.Group = {
  name: 'CheckboxGroup',

  mounted() {
    const { handleChange, $children, checkedDatum } = this
    this.$on('handleSingleCheckboxChange', handleChange)

    if (checkedDatum.all) {
      $children.forEach(c => {
        checkedDatum[c.name] = true
        c.check = true
      })
    }
  },

  computed: {
    checkedDatum() {
      const { $children } = this
      return $children.reduce((data, child)=> {
        const { name, check } = child

        if (name === 'all') {
          this.$all = child
        }

        data[name] = !!check
        return data
      }, {})
    },

    counts() {
      const { checkedDatum } = this
      const datum = Object.keys(checkedDatum)
      const total = datum.length - (this.$all ? 1 : 0)
      const checked = datum.filter(d => d !== 'all' && checkedDatum[d]).length

      return {
        total, checked,
      }
    },
  },

  methods: {
    handleChange(checked) {
      const checkedDatum = {
        ...this.checkedDatum,
        ...checked,
      }

      const { $children, counts } = this
      const isClickedAll = (checked.all !== undefined)

      if (this.$all) {
        if (isClickedAll) {
          this.$all.check = checked.all
          $children.forEach((c)=> {
            checkedDatum[c.name] = checked.all
            c.check = checked.all
          })
        } else {
          this.$all.check = checkedDatum.all = (counts.checked >= counts.total)
        }
      }

      this.$emit('change', checkedDatum)
    },
  },

  render(h) {
    const { $slots } = this
    return (
      <div class={[s.cbGroup]}>
        {$slots.default}
      </div>
    )
  },
}
module.exports = Checkbox
