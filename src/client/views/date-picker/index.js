import DatePicker from '~com/date-picker'

const DatePickerDoc = {
  name: 'DatePickerDoc',
  render(h) {
    const { $slots } = this
    return (
      <div>
        <DatePicker />
      </div>
    )
  }
}

module.exports = DatePickerDoc
