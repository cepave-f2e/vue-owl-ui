import TimePicker from '~com/time-picker'
import delegate from 'delegate-to'

const TimePickerDoc = {
  name: 'TimePickerDoc',
  methods: {

  },
  render(h) {
    const { $slots, aa } = this

    return (
      <div>
        <TimePicker />
      </div>
    )
  }
}

module.exports = TimePickerDoc
