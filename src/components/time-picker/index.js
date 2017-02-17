import s from './time-picker.scss'
import isTimeFormat from './is-time-format'
import prefix0 from './prefix0'
import delegate from 'delegate-to'
import Icon from '../icon'

const TimePicker = {
  name: 'TimePicker',
  props: {
    start: {
      type: String,
      default: '09:00',
    },
    end: {
      type: String,
      default: '22:00',
    },
    step: {
      type: Number,
      default: 15, // mins
    },

    open: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      value: '',
    }
  },

  watch: {
    open(opened) {
      const { $el } = this

      if (opened) {
        $el.focus()
      } else {
        $el.blur()
      }
    }
  },

  created() {
    const { start, end } = this

    isTimeFormat(start)
    isTimeFormat(end)
  },

  methods: {
    pickTime: delegate('li', function (ev) {
      ev.stopPropagation()

      const { delegateTarget } = ev
      const time = (delegateTarget.getAttribute('data-time'))
      if (this.value === time) {
        return
      }

      this.$el.blur()
      this.value = time
      this.$emit('change', {
        time
      })
    })
  },

  computed: {
    renderTime() {
      const h = this.$createElement
      const { start, end, step } = this
      let [startHour, startMin] = start.split(':')
      let [endHour, endMin] = end.split(':')
      startHour = +startHour
      startMin = +startMin
      endHour = +endHour
      endMin = +endMin

      const lis = [
        <li data-time={start}>
          <code>{start}</code>
        </li>
      ]

      while ((startHour * 60 + startMin) < (endHour * 60 + endMin)) {
        startMin += step
        if (startMin >= 60) {
          startMin = 0
          startHour += 1
        }

        const time = `${prefix0(startHour)}:${prefix0(startMin)}`
        lis.push(
          <li data-time={time}>
            <code>{time}</code>
          </li>
        )
      }

      return lis
    },
  },

  mounted() {
    const { open, $el } = this

    if (open) {
      $el.focus()
    }
  },

  render(h) {
    const { renderTime, pickTime, value } = this
    return (
      <div class={[s.timepicker]} tabIndex="-1">
        <span class={[s.input]}  >
          {value} <Icon typ="clock" class={[s.clock]} />
        </span>
        <ul class={[s.timebox]} onClick={pickTime}>
          { renderTime }
        </ul>
      </div>
    )
  }
}

module.exports = TimePicker
