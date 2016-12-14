import DualList from '../../../components/dual-list'
import Markdown from '../../components/markdown'
import s from './dual-list.scss'

const DualListPage = {
  name: 'DualListPage',

  data() {
    return {
      output: { 14: 'Meowth', 15: 'Abra', 16: 'Doduo', 17: 'Dodrio' },
      labels: [
        'Squirtle',
        'Caterpie',
        'Raticate',
        'Fearow',
        'Clefairy',
        'Venonat',
        'Psyduck',
        'Eevee',
        'Mew',
        'Pikachu',
        'Golduck',
        'Vulpix',
        'Mewtwo',
        'Raichu'
      ],
      selectedLabel: [
        'Meowth',
        'Abra',
        'Doduo',
        'Dodrio'
      ]
    }
  },

  methods: {
    getDualData(data) {
      this.output = Object.assign({}, data)
    },
    getInputValue(data) {},
    removeInput() {}
  },

  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <DualList items={this.labels} selectedItems={this.selectedLabel} class={[s.dualGroup]} onChange={this.getDualData} />
        <div class={[s.code]}>
          <pre>
            <code>
              {JSON.stringify(this.output, null, 2)}
            </code>
          </pre>
        </div>
      </div>
    )
  }
}

module.exports = DualListPage
