import Icon from '../icon'
import delegate from 'delegate-to'
import s from './label.scss'

const Label = {
  name: 'Label',
  props: {
    typ: {
      type: String,
      default: 'label', //label, outline, tag
    },
    status: {
      type: String,
      default: 'default', //default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false,
    },
    x: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      const { status, typ, badge, x } = this
      const style = [s.label, s[typ], s[`${status}${typ}`]]
      if (badge) {
        style.push(s.badge)
      }
      if (x) {
        style.push(s.x)
        style.push(s[`${status}${typ}x`])
      }
      return style
    },
  },

  render(h) {
    const { $slots, style, x, handleCloseLabel } = this
    return (
      <span class={style}>
        {$slots.default}
        {
          (x)
          ? <Icon typ="x" size={12} class={[s.iconx]} />
          : ''
        }
      </span>
    )
  },
}
Label.Group = {
  name: 'LabelGroup',

  props: {
    options: {
      type: Array,
      required: true,
    },
    focused: {
      type: Number,
      default: -1,
    },
    displayKey: {
      type: String,
      required: true,
    },
    typ: {
      type: String,
      default: 'label', //label, outline, tag
    },
    status: {
      type: String,
      default: 'default', //default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false,
    },
    x: {
      type: Boolean,
      default: false,
    },
    newTag: {
      type: Boolean,
      default: false,
    },
    newTagMsg: {
      type: String,
      default: '+ New Tag',
    },
    preventDuplicate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      labelData: this.options,
      focusedLabel: this.focused,
      showInput: false,
    }
  },

  watch: {
    options(newVal) {
      this.labelData = newVal
    },
    focused(newVal) {
      this.focusedLabel = newVal
    },
    labelData(newVal) {
      this.$emit('change', this.labelData)
    },
  },

  computed: {
    renderLabels() {
      const { labelData, x, displayKey } = this
      const h = this.$createElement
      const props = {
        typ: this.typ,
        status: this.status,
        badge: this.badge,
        x: this.x,
      }
      const _labels = this.labelData.map((label, idx) => {
        const style = {
          [s.labelInGroup]: true,
        }
        style[s.focused] = (this.focusedLabel > -1 && this.focusedLabel === idx && this.hasFocusedStyle) ? true : false
        
        return (
          <Label { ...{ props } } 
                  data-role="labelg" 
                  data-val={label[displayKey]} 
                  data-id={idx} 
                  class={style}
          >
            {label[displayKey]}
          </Label>
        )
      })
      return _labels
    },

    hasFocusedStyle() {
      const { typ, status } = this
      return (status === 'default' && typ === 'outline') ? true : false
    },

    newTagInputStyle() {
      const { showInput } = this
      const styles = [s.label, s.newTag, s.labelInGroup, { [s.showInput]: showInput }]
      return styles
    },
  },

  methods: {
    _handleClickLabel: delegate('[data-role="labelg"]', function(e) {
      const { delegateTarget } = e
      const clickedLabel = delegateTarget.getAttribute('data-val')
      const clickedId = delegateTarget.getAttribute('data-id')// newly given id, starts with 0
      if (this.x) { // if labelGroup all closable
        const removedLabel = this.labelData[clickedId]

        this.labelData = this.labelData.reduce((preVal, newVal, idx) => {
          if (idx !== +clickedId) {
            preVal.push(newVal)
          }
          return preVal
        }, [])
        
        this.$emit('remove', removedLabel)
      }
    }),

    handleNewTagClick(e) {
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.addNewTag.focus()
      })
    },

    handleNewTagInputBlur(e) {
      this.showInput = false
    },

    handleInputKeyDown(e) {
      const { displayKey, preventDuplicate } = this

      if (e.keyCode === 13) { 
        if (!this.$refs.addNewTag.value) {
          return
        }

        if (preventDuplicate) {
          const duplicate = this.labelData.find((data, idx) => {
            return data[displayKey] === this.$refs.addNewTag.value
          })

          if (duplicate) {
            return
          }
        }

        this.labelData.push({
          [displayKey]: this.$refs.addNewTag.value,
        })
        this.$refs.addNewTag.value = ''
        this.showInput = false

        this.$emit('create', this.$refs.addNewTag.value)
      }
    },
  },

  render(h) {
    const { renderLabels, _handleClickLabel, newTagInputStyle, newTag, newTagMsg } = this
    const props = {
      typ: this.typ,
      status: this.status,
      badge: this.badge,
    }
    return (
      <div onClick={_handleClickLabel}>
        {renderLabels}
        {
          (newTag)
          ? <Label { ...{ props } } class={newTagInputStyle} nativeOn-click={this.handleNewTagClick}>
            <span>{newTagMsg}</span>
            <input class={s.newTagInput} 
                    ref="addNewTag" 
                    onBlur={this.handleNewTagInputBlur} 
                    on-keydown={this.handleInputKeyDown}
            />
          </Label>
          : ''
        }
      </div>
    )
  },
}

module.exports = Label
