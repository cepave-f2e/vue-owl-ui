import s from './notification.scss'
import Icon from '../icon'

const Notification = {
  name: 'Notification',
  props: {
    duration: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    // id: {
    //   type: Number,
    //   required: true,
    // },
  },
  mounted() {
    const { duration } = this
    if (duration > 0) {
      this.timer = setTimeout(() => {
        this.close()
      }, duration)
    }
  },

  data() {
    return {
      id: 0,
      closed: false,
      styles: [s.notification, s.fadeIn],
    }
  },

  methods: {
    close(ev) {
      if (ev) {
        ev.preventDefault()
      }
      if (!this.closed) {
        this.destroyElement()
      }
    },

    destroyElement() {
      this.styles = [s.notification, s.fadeOut]
      setTimeout(() => {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }, 450)
      this.closed = true
    },
  },

  render(h) {
    const { $slots, message, title, close, styles, id } = this
    return (
      <div class={styles} data-idx={id} data-role="notification-view">
        <span class={s.x} on-click={close}></span>
        <p class={s.title}>{title}</p>
        <p class={s.message}>{message}</p>
      </div>
    )
  },
}

module.exports = Notification