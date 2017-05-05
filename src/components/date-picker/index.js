import Icon from '../icon'
import s from './date-picker.scss'
import Cal from './cal'
import dateFormat from './date-format'

const DatePicker = {
  name: 'DatePicker',
  props: {
    yearMonth: {
      type: Array,
      default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1],
    },

    format: {
      type: String,
      default: 'yyyy/mm/dd',
    },

    min: {
      type: Date,
    },

    max: {
      type: Date,
    },

    firstDayOfWeek: {
      type: Number,
      default: 1,
    },

    colorfulWeekend: {
      type: Boolean,
      default: false,
    },

    open: {
      type: Boolean,
      default: false,
    },

    defaultValue: {
      type: String,
      default: '',
    },

    hasTime: {
      type: Boolean,
      default: false,
    },

    timeProps: {
      type: Object,
    },
  },

  watch: {
    yearMonth(newYearMonth) {
      const [year, month] = newYearMonth

      this.year = year
      this.month = month
    },

    open(open) {
      const { $el } = this
      if (open) {
        $el.focus()
      } else {
        $el.blur()
      }
    },
    defaultValue(value) {
      this.value = value
    },
  },

  data() {
    const [year, month] = this.yearMonth

    const { defaultValue, format, hasTime } = this
    let value = defaultValue || dateFormat(new Date(), this.format)

    if (hasTime) {
      value = `${value} ${Date().match(/\d\d:\d\d/)[0]}`
    }
    return {
      year,
      month,
      value,
      focused: false,
    }
  },

  methods: {
    handlePick(d) {
      const { format, $el, hasTime } = this
      let value = dateFormat(d.Date, format)

      if (hasTime) {
        value = `${value} ${d.time}`
      }

      $el.blur()
      this.$emit('pick', {
        value,
        ...d,
      })

      this.value = value
    },
    onNext(d) {
      this.$emit('next', d)
    },
    onPrev(d) {
      this.$emit('prev', d)
    },

    onBlur() {
      if (this.lockBlur) {
        return
      }

      this.focused = false
    },

    onFocus() {
      this.focused = true
    },

    onTime(stat) {
      this.lockBlur = (stat === 'in')
    },

    onTimeChange(d) {
      this.$el.focus()

      this.value = this.value.replace(/\d\d:\d\d/, d.time)

      this.$emit('pick', {
        value: this.value,
        ...d,
      })
    },

    onTimeBlur() {
      this.focused = false
    },
  },

  computed: {
    classes() {
      const { colorfulWeekend, focused, hasTime } = this

      return {
        [s.colorfulWeekend]: colorfulWeekend,
        [s.focused]: focused,
        [s.hasTime]: hasTime,
      }
    },
  },

  render(h) {
    const { classes, yearMonth, min, max, firstDayOfWeek, colorfulWeekend, value,
    handlePick, onNext, onPrev, onBlur, onFocus, onTime, onTimeChange, onTimeBlur,
    timeProps, hasTime } = this

    return (
      <div class={[s.picker, classes]} tabIndex="-1" onBlur={onBlur} onFocus={onFocus}>
        <div class={[s.input]}>
          <Icon typ="date" class={[s.cal]} />
          <span class={[s.value]}>
            { value }
          </span>
        </div>
        <div>
          <Cal yearMonth={yearMonth} min={min} max={max}
               firstDayOfWeek={firstDayOfWeek}
               onPick={handlePick}
               onNext={onNext}
               onPrev={onPrev}
               onTime={onTime}
               onTimeChange={onTimeChange}
               onTimeBlur={onTimeBlur}
               hasTime={hasTime}
               timeProps={timeProps}
               colorfulWeekend={colorfulWeekend} />
        </div>
      </div>
    )
  },
}

module.exports = DatePicker
