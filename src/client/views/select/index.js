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
      options: [
        { value: '1d', title: <b>1 day</b> },
        { value: '3d', title: '3 days', checked: true },
        { value: '5d', title: '5 days' },
      ],
    }
  },

  methods: {
    selectOnChange(d) {
      this.outputs = d
    },
  },

  render(h) {
    const { outputs, options, selectOnChange } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <pre>
          <code>
          {JSON.stringify(outputs)}
          </code>
        </pre>
        <Select onChange={selectOnChange}>
          {
            options.map((opt) => {
              return (
                <Select.Option value={opt.value} checked={opt.checked}>
                  { opt.title }
                </Select.Option>
              )
            })
          }
        </Select>
      </div>
    )
  },
}

module.exports = SelectPage
