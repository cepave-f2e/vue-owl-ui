import { isBrowser } from '../is-env'
import s from './lightbox.scss'

let lbDiv
const lbDivID = 'owl-ui-lb'
if (isBrowser && !document.querySelector(`#${lbDivID}`)) {
  lbDiv = document.createElement('div')
  lbDiv.id = lbDivID

  // check jsdom env
  if (document.body.append) {
    document.body.append(lbDiv)
  }
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
      default: false
    },
    closeOnClickMask: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: 'rgba(255, 255, 255, .8)',
    }
  },

  data() {
    return {
      opened: false,
    }
  },

  methods: {
    open(ev) {
      ev.preventDefault()
      const { view } = this

      view.display = 'block'
      lbDiv.append(view.$el)

      this.$nextTick(() => {
        view.$el.focus()
      })

      document.body.style.overflow = 'hidden'
    },

    close(ev) {
      ev.preventDefault()
      const { view } = this

      view.display = 'none'
      lbDiv.innerHTML = ''
      document.body.style.overflow = 'visible'
    }
  },

  computed: {
    view() {
      return this.$children.find(vm => vm.$el.dataset.role === 'lb-view')
    }
  },

  mounted() {
    this.$on('LB_OPEN', this.open)
  },

  render(h) {
    const { $slots } = this
    return (
      <div class={[s.lbWrap]}>
        { $slots.default }
      </div>
    )
  }
}

LightBox.Close = {
  name: 'LightBoxClose',
  props: {
    event: {
      type: String,
      default: 'click'
    }
  },

  render(h) {
    const { $slots, event, $parent } = this

    const opts = {
      on: {
        [event]: $parent.$parent.close
      }
    }
    return (
      <div {...opts} data-role="lb-close" class={[s.close]}>
        {$slots.default}
      </div>
    )
  }
}

LightBox.Open = {
  name: 'LightBoxOpen',
  props: {
    event: {
      type: String,
      default: 'click'
    }
  },

  render(h) {
    const { $slots, event } = this
    const opts = {
      on: {
        [event]: this.$parent.open
      }
    }
    return (
      <div {...opts} data-role="lb-open" class={[s.open]}>
        {$slots.default}
      </div>
    )
  }
}

LightBox.View = {
  name: 'LightBoxView',
  props: {},

  data() {
    return {
      display: 'none'
    }
  },
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
      const { bgColor } = this.$parent
      const { display } = this

      return {
        backgroundColor: bgColor,
        display
      }
    }
  },

  render(h) {
    const { $slots, viewStyle, style } = this
    const { closeOnESC, closeOnClickMask, close, } = this.$parent

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
        <div class={[s.view]} on-click={ev => ev.stopPropagation()} style={viewStyle}>
          <span class={[s.x]} on-click={close}/>
          {$slots.default}
        </div>
      </div>
    )
  }
}

module.exports = LightBox
