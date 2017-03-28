import DualList from '../../../components/dual-list'
import Markdown from '../../components/markdown'
import s from './dual-list.scss'

const DualListPage = {
  name: 'DualListPage',

  data() {
    return {
      output: {
        10: { name: 'Hippopotmonstrosesquipadaliophobiahipo', id: '20' }, 11: { name: 'Abra', id: '21' },
        12: { name: 'Doduo', id: '22' }, 13: { name: 'Dodrio', id: '23' },
      },
      labels: [
        { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
        { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' },
        { name: 'Clefairy', id: '5' }, { name: 'Venonat', id: '6' },
        { name: 'Psyduck', id: '7' }, { name: 'Pikachu', id: '8' },
        { name: 'Vulpix', id: '9' }, { name: 'Raichu', id: '10' },
      ],
      selectedLabel: [
        { name: 'Hippopotmonstrosesquipadaliophobiahipo', id: '20' }, { name: 'Abra', id: '21' },
        { name: 'Doduo', id: '22' }, { name: 'Dodrio', id: '23' },
      ],
    }
  },

  methods: {
    getDualData(data) {
      this.output = Object.assign({}, data)
    },
    getInputValue(data) {},
  },

  mounted() {
    window.setTimeout(() => {
      this.labels = [
        { name: 'Squirtle', id: '1' }, { name: 'Caterpie', id: '2' },
        { name: 'Raticate', id: '3' }, { name: 'Fearow', id: '4' },
        { name: 'Clefairy', id: '5' }, { name: 'Venonat', id: '6' },
      ]
    }, 6000)
  },

  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <DualList items={this.labels} selectedItems={this.selectedLabel} class={[s.dualGroup]} onChange={this.getDualData} displayKey="name" caseInsensitive />
        <div class={[s.code]}>
          <pre>
            <code>
              {JSON.stringify(this.output, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    )
  },
}

module.exports = DualListPage
