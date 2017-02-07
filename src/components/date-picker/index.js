import Icon from '~com/icon'
import s from './date-picker.scss'
import Cal from './cal'

const DatePicker = {
  name: 'DatePicker',
  props: {
    yearMonth: {
      type: Array,
      require: true,
      default: () => [(new Date).getFullYear(), (new Date).getMonth() + 1]
    },

    range: {
      type: Boolean,
      default: false,
    },

  },

  data() {
    const [year, month] = this.yearMonth
    return {
      year,
      month,
    }
  },

  methods: {

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
    const { classes, } = this
    return (
      <div class={[s.picker, classes]}>
        <Icon typ="date" class={[s.cal]} />
        <Cal min={new Date('2017/1/1')} max={new Date(`2017/3/20`)} />
      </div>
    )
  }
}

module.exports = DatePicker
