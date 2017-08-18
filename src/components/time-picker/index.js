import s from './time-picker.scss'
import isTimeFormat from './is-time-format'
import prefix0 from './prefix0'
import delegate from 'delegate-to'
import Icon from '../icon'
import moment from 'moment/moment'

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
    },

    defaultValue: {
      type: String,
      default: Date().match(/\d\d:\d\d/)[0], // Current time of client
    },

    incluedNow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      value: this.defaultValue,
      focused: false,
    }
  },

  watch: {
    defaultValue(time) {
      this.value = time
    },

    open(opened) {
      const { $el } = this

      if (opened) {
        $el.focus()
      } else {
        $el.blur()
      }
    },
  },

  created() {
    const { start, end } = this

    isTimeFormat(start)
    isTimeFormat(end)
  },

  methods: {
    onFocus() {
      this.focused = true
      this.$emit('focus')
    },

    onBlur() {
      this.focused = false
      this.$emit('blur')
    },

    pickTime: delegate('li', function (ev) {
      ev.stopPropagation()

      const { delegateTarget } = ev
      let value = ''
      const dataTimeText = delegateTarget.getAttribute('data-time')
      if (dataTimeText === 'now') {
        value = moment().format('hh:mm')
      } else {
        value = dataTimeText
      }
      if (this.value === value && dataTimeText !== 'now') {
        return
      }

      this.$el.blur()
      this.value = value
      const [h, m] = value.split(':')

      this.$emit('change', {
        value,
        h: +h,
        m: +m,
      })
    }),
  },

  computed: {
    renderTime() {
      const { start, end, step } = this
      let [startHour, startMin] = start.split(':')
      let [endHour, endMin] = end.split(':')
      startHour = +startHour
      startMin = +startMin
      endHour = +endHour
      endMin = +endMin

      const lis = []
      if (this.incluedNow) {
        lis.push(
          <li data-time={'now'}>
            <code>now</code>
          </li>,
        )
      }
      lis.push(
        <li data-time={start}>
          <code>{start}</code>
        </li>,
      )
      while ((startHour * 60 + startMin) <= (endHour * 60 + endMin - step)) {
        startMin += step
        if (startMin >= 60) {
          startMin = startMin - 60
          startHour += 1
        }

        const time = `${prefix0(startHour)}:${prefix0(startMin)}`
        lis.push(
          <li data-time={time}>
            <code>{time}</code>
          </li>,
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
    const { renderTime, pickTime, value, onFocus, onBlur } = this
    return (
      <div class={[s.timepicker]} tabIndex="-1"
        onFocus={onFocus}
        onBlur={onBlur}>
        <div class={[s.input]}>
          {value} <Icon typ="clock" class={[s.clock]} />
        </div>
        <ul class={[s.timebox]} onClick={pickTime}>
          { renderTime }
        </ul>
      </div>
    )
  },
}

module.exports = TimePicker
