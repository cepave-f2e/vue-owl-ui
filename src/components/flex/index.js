import s from './flex.scss'

const Flex = {
  name: 'Flex',
  props: {
    grids: {
      type: Number,
      default: 12,
    },

    margin: {
      type: Number,
      default: 20,
    },

    mid: {
      type: Boolean,
      default: false,
    },

    split: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        [s.flexMid]: this.mid,
        [s.flexSplit]: this.split,
      }
    }
  },
  render(h) {
    const { $slots, classes } = this
    return (
      <div class={[s.flex, classes]}>
        { $slots.default }
      </div>
    )
  }
}

Flex.Col = {
  name: 'FlexCol',
  props: {
    offset: {
      type: [Number, String],
    },
    size: {
      type: [Number, String],
    },
    width: {
      type: [Number, String],
    },
    mid: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    style() {
      const { $parent, size, offset } = this

      const styleObj = {
        marginRight: `${$parent.margin}px`,
      }

      if (size === 'auto') {
        styleObj.flex = 1
      } else {
        styleObj.width = `${100 / $parent.grids * size}%`
      }

      if (offset) {
        styleObj.marginLeft = `${100 / $parent.grids * offset}%`
      }

      return styleObj
    },

    classes() {
      return {
        [s.flexMid]: this.mid,
      }
    }
  },

  render(h) {
    const { $slots, classes, style } = this
    return (
      <div style={style} class={classes}>
        { $slots.default }
      </div>
    )
  }
}

module.exports = Flex
