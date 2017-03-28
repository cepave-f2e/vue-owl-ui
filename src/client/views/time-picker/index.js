import TimePicker from '~com/time-picker'
import delegate from 'delegate-to'
import Markdown from '../../components/markdown'

const TimePickerDoc = {
  name: 'TimePickerDoc',
  methods: {

  },
  data() {
    return {
      outs: {

      },
    }
  },

  methods: {
    onChange(data) {
      this.outs = data
    },
  },
  render(h) {
    const { onChange, outs } = this

    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <pre>
          <code>{ JSON.stringify(outs) }</code>
        </pre>
        <TimePicker onChange={onChange} ref="time1" />
      </div>
    )
  },
}

module.exports = TimePickerDoc
