import MultiSelect from '../../../components/multi-select'
import Markdown from '../../components/markdown'
import s from './multi-select.scss'

const MultiSelectPage = {
  name: 'MultiSelectPage',
  data() {
    return {
      selectedItems: [0, 1],
      options: [
        { value: 'vulpix', id: 23 },
        { value: 'caterpie', id: 26 },
        { value: 'Pikachu', id: 24 },
        { value: 'charmander', id: 25 },
        { value: 'bulbasaur', id: 20 },
        { value: 'Squirtle', id: 19 },
        { value: 'raticate', id: 18 },
        { value: 'fearow', id: 17 },
        { value: 'psyduck', id: 16 },
        { value:'duduo', id: 1 }
      ],
      output: [
        { value: 'vulpix', id: 23 },
        { value: 'caterpie', id: 26 },
      ],
    }
  },

  methods: {
    getMultiSelectData(data) {
      this.output = Object.assign({}, data)
    }
  },

  render(h) {
    const { $slots } = this
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div class={[s.demoGroup]}>
          <div class={[s.multiSelect]}>
            <MultiSelect selectedIdx={this.selectedItems} 
                         options={this.options} 
                         onChange={this.getMultiSelectData}
                         displayKey="value" 
                         caseInsensitive
                         loading
            />
          </div>
          <div class={[s.code]}>
            <pre>
              <code>
                {JSON.stringify(this.output, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = MultiSelectPage
