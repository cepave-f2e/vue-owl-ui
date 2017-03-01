import Icon from '../icon'
import s from './date-picker.scss'
import Cal from './cal'
import dateFormat from './date-format'

const DatePicker = {
  name: 'DatePicker',
  props: {
    yearMonth: {
      type: Array,
      require: true,
      default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1]
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
      default: false
    },

    defaultValue: {
      type: String,
      default: '',
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
    }
  },

  data() {
    const [year, month] = this.yearMonth

    const { defaultValue, format } = this
    return {
      year,
      month,
      value: defaultValue || dateFormat(new Date(), this.format)
    }
  },

  methods: {
    handlePick(d) {
      const { format, $el } = this
      this.value = dateFormat(d.Date, format)

      $el.blur()
      this.$emit('pick', {
        value: this.value,
        ...d
      })
    },
    onNext(d) {
      this.$emit('next', d)
    },
    onPrev(d) {
      this.$emit('prev', d)
    }
  },

  computed: {
    classes() {
      const { colorfulWeekend } = this

      return {
        [s.colorfulWeekend]: colorfulWeekend
      }
    },
  },

  render(h) {
    const { classes, yearMonth, min, max, firstDayOfWeek, colorfulWeekend, value,
    handlePick, onNext, onPrev } = this

    return (
      <div class={[s.picker, classes]} tabIndex="-1">
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
            onPrev= {onPrev}
            colorfulWeekend={colorfulWeekend} />
        </div>
      </div>
    )
  }
}

module.exports = DatePicker
