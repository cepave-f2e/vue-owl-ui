import s from './message.scss'
import Icon from '../icon'
import Vue from 'vue'

const iconImg = {
  primary: 'alarm',
  warning: 'alarm-1',
  success: 'check-circle',
  error: 'x',
}

const MessageComponent = {
  name: 'MessageComponent',

  data() {
    return {
      timer: null,
      animation: 'slideDown',
    }
  },

  props: {
    message: {
      type: String,
    },

    type: {
      type: String,
      default: 'primary',
    },

    duration: {
      type: Number,
      default: 3000,
    },

    showClose: {
      type: Boolean,
      default: false,
    },

    iconClass: {
      type: String,
    },

    customClass: {
      type: String,
    },

    onClose: {
      type: Function,
    },
  },

  mounted() {
    this.startTimer()
  },

  destroyed() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    } else {
      this.$el.remove()
    }
  },

  methods: {
    close() {
      this.animation = 'slideUp'

      setTimeout(() => {
        this.$destroy()
      }, 300)

      if (this.onClose) {
        this.onClose()
      }
    },

    clearTimer() {
      clearTimeout(this.timer)
      this.timer = null
    },

    startTimer() {
      const { duration, close } = this
      if (duration > 0) {
        this.timer = setTimeout(() => {
          close()
        }, duration)
      }
    },
  },

  render(h) {
    const { animation, startTimer, clearTimer,
      message, type, showClose, iconClass, close } = this

    return (
      <div class={[s.message, s[animation]]} onMouseenter={clearTimer} onMouseleave={startTimer}>
        {
          !iconClass &&
          <Icon typ={iconImg[type]} size={20} class={[s.messageIcon, s[type]]} />
        }
        <div class={ [s.messageContent, { [s.hasIcon]: iconClass }] }>
          <p>
            {
              !!iconClass &&
              <i class={[s.customIcon, iconClass]} />
            }
            {message}
          </p>
          {
            showClose &&
            <Icon fill="#bfcbd9" typ="x" size={20} class={s.closeBtn} nativeOnClick={close} />
          }
        </div>
      </div>
    )
  },
}

const Message = ((options = {}) => {
  if (typeof options === 'string') {
    options = {
      message: options,
    }
  }
  const MessageConstructor = Vue.extend(MessageComponent)
  const instance = new MessageConstructor({
    propsData: options,
  })
  const message = instance.$mount()
  document.body.appendChild(message.$el)
  return message
})

module.exports = Message
