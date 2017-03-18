import Select from '~com/select'
import Markdown from '../../components/markdown'

const SelectPage = {
  name: 'SelectPage',
  data() {
    return {
      outputs: {
        value: '3d',
        idx: 1,
      },
      selectProps: {
        options: [
          { value: '1d', title: '1 day', },
          { value: '3d', title: '3 days', selected: true },
          { value: '5d', title: '5 days' },
        ],
      },
    }
  },

  methods: {
    selectOnChange(d) {
      this.outputs = d
    }
  },

  render(h) {
    const { selectProps, outputs, selectOnChange } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <pre>
          <code>
          {JSON.stringify(outputs)}
          </code>
        </pre>
        <Select {...{ props: selectProps }} onChange={selectOnChange} />

      </div>
    )
  }
}

module.exports = SelectPage
