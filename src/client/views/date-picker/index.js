import DatePicker from '~com/date-picker'

import Markdown from '../../components/markdown'

const DatePickerDoc = {
  name: 'DatePickerDoc',
  data() {
    return {
      outs: {},
    }
  },
  methods: {
    onPick(d) {
      this.outs = d
    },
  },
  render(h) {
    const { outs, onPick } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <pre>
          <code>
            data: { JSON.stringify(outs, null, 2) }
          </code>
        </pre>
        <DatePicker onPick={onPick} />
      </div>
    )
  },
}

module.exports = DatePickerDoc
