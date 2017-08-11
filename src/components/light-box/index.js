import { isBrowser } from '../is-env'
import s from './lightbox.scss'

let lbDiv
const lbDivID = 'owl-ui-lb'
if (isBrowser && !document.getElementById(`${lbDivID}`)) {
  lbDiv = document.createElement('div')
  lbDiv.id = lbDivID

  document.body.appendChild(lbDiv)
}

const LightBox = {
  name: 'LightBox',
  props: {
    width: {
      type: [String, Number],
      default: 700,
    },
    closeOnESC: {
      type: Boolean,
      default: false,
    },
    closeOnClickMask: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: 'rgba(255, 255, 255, .8)',
    },
    closeHook: {
      type: [Boolean, Function],
      default: false,
    },
    openHook: {
      type: [Boolean, Function],
      default: false,
    },
  },

  data() {
    return {
      opened: false,
      libDiv: document.getElementById(`${lbDivID}`),
    }
  },

  watch: {
    opened(bool) {
      if (bool) {
        const { view } = this
        this.libDiv.appendChild(view.$el)
        document.body.style.overflow = 'hidden'
        this.$nextTick(() => {
          view.$el.focus()
        })
        if (this.openHook && typeof (this.openHook) === 'function') {
          this.openHook()
        }
      } else {
        this.libDiv.innerHTML = ''
        document.body.style.overflow = 'visible'
        if (this.closeHook && typeof (this.closeHook) === 'function') {
          this.closeHook()
        }
      }
    },
  },

  methods: {
    open(ev) {
      if (ev) {
        ev.preventDefault()
      }

      this.opened = true
      this.$emit('open')
    },

    close(ev) {
      if (ev) {
        ev.preventDefault()
      }

      this.opened = false
      this.$emit('close')
    },
  },

  computed: {
    view() {
      return this.$children.find((vm) => vm.$el.getAttribute('data-role') === 'lb-view')
    },
  },

  render(h) {
    const { $slots } = this
    return (
      <div class={[s.lbWrap]}>
        { $slots.default }
      </div>
    )
  },
}

LightBox.Close = {
  name: 'LightBoxClose',
  props: {
    event: {
      type: String,
      default: 'click',
    },
  },

  render(h) {
    const { $slots, event, $parent } = this

    const opts = {
      on: {
        [event]: $parent.$parent.close,
      },
    }
    return (
      <div {...opts} data-role="lb-close" class={[s.close]}>
        {$slots.default}
      </div>
    )
  },
}

LightBox.Open = {
  name: 'LightBoxOpen',
  props: {
    event: {
      type: String,
      default: 'click',
    },
  },

  render(h) {
    const { $slots, event } = this
    const opts = {
      on: {
        [event]: this.$parent.open,
      },
    }
    return (
      <div {...opts} data-role="lb-open" class={[s.open]}>
        {$slots.default}
      </div>
    )
  },
}

LightBox.View = {
  name: 'LightBoxView',
  props: {},

  computed: {
    viewStyle() {
      let { width } = this.$parent

      if (!isNaN(+width)) {
        width = `${width}px`
      }
      return {
        width,
      }
    },

    style() {
      const { bgColor, opened } = this.$parent

      return {
        backgroundColor: bgColor,
        display: opened ? 'block' : 'none',
      }
    },
  },

  render(h) {
    const { $slots, viewStyle, style } = this
    const { closeOnESC, closeOnClickMask, close } = this.$parent

    const on = {}

    if (closeOnClickMask) {
      on.click = close
    }

    if (closeOnESC) {
      on.keydown = (ev) => {
        if (ev.keyCode !== 27) {
          return
        }

        close(ev)
      }
    }

    return (
      <div data-role="lb-view" class={[s.lb]} tabindex="-1" style={style} {...{ on }}>
        <div class={[s.view]} on-click={(ev) => ev.stopPropagation()} style={viewStyle}>
          <span class={[s.x]} on-click={close} />
          {$slots.default}
        </div>
      </div>
    )
  },
}

module.exports = LightBox
