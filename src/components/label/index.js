import Icon from '../icon'
import delegate from 'delegate-to'
import s from './label.scss'

const Label = {
  name: 'Label',
  props: {
    typ: {
      type: String,
      default: 'label'//label, outline, tag
    },
    status: {
      type: String,
      default: 'default'//default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    }
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
    }
  },
  methods: {
    handleCloseLabel (e) {
      // console.log(this.$el);
      // this.$el.parentNode.removeChild(this.$el)
    }
  },
  render(h) {
    const { $slots, style, x, handleCloseLabel } = this
    return (
      <div class={style}>
        {$slots.default}
        {
          (x)
          ? <Icon typ="x" size={12} class={[s.iconx]} nativeOn-click={handleCloseLabel} />
          : ''
        }
      </div>
    )
  }
}
Label.Group = {
  name: 'LabelGroup',
  props: {
    options: {
      type: Array,
      required: true
    },
    typ: {
      type: String,
      default: 'label'//label, outline, tag
    },
    status: {
      type: String,
      default: 'default'//default, primary, success, error, warning, inverted
    },
    badge: {
      type: Boolean,
      default: false
    },
    x: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labelData: this.options,
    }
  },
  watch: {
    options() {
      this.labelData = this.options
    }
  },
  computed: {
    renderLabels() {
      const { labelData, x } = this
      const h = this.$createElement
      const props = {
        typ: this.typ,
        status: this.status,
        badge: this.badge,
        x: this.x
      }
      const _labels = this.labelData.map((label, idx) => {
        return (
          <Label { ...{ props } } data-role="labelg" data-val={label.value} data-id={idx} class={[s.labelInGroup]}>{label.title}</Label>
        )
      })
      return _labels
    }
  },
  methods: {
    _handleClickLabel: delegate('[data-role="labelg"]', function(e) {
      const { delegateTarget } = e
      const clickedLabel = delegateTarget.getAttribute('data-val')
      //newly given id
      const clickedId = delegateTarget.getAttribute('data-id')
      if (this.x) { //if labelGroup are all closable
        const removedLabel = this.labelData[clickedId]
        this.labelData = this.labelData.reduce((preVal, newVal, idx) => {
          if (idx !== +clickedId) {
            preVal.push(newVal)
          }
          return preVal
        }, [])
        this.$emit('change', this.labelData)
        this.$emit('remove', removedLabel)
      }
    })
  },
  render(h) {
    const { renderLabels, _handleClickLabel } = this
    return (
      <div class={[s.labelGroup]} onClick={_handleClickLabel}>
        {renderLabels}
      </div>
    )
  }
}

module.exports = Label
