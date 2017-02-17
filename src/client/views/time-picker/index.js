import TimePicker from '~com/time-picker'
import delegate from 'delegate-to'
import Markdown from '../../components/markdown'

const TimePickerDoc = {
  name: 'TimePickerDoc',
  methods: {

  },
  data() {
    return {
      outs: {}
    }
  },

  methods: {
    onChange(data) {
      this.outs = data
    }
  },
  render(h) {
    const { $slots, onChange, outs } = this

    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <pre>
          <code>data: { JSON.stringify(outs, null, 2) }</code>
        </pre>
        <TimePicker onChange={onChange} />
      </div>
    )
  }
}

module.exports = TimePickerDoc
