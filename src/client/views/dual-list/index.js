import Dual from '../../../components/dual-list'
import Markdown from '../../components/markdown'
import s from './dual-list.scss'

const DualListBoxPage = {
  name: 'DualListBoxPage',
  data() {
    return {
      output: { 15: 'Meowth', 16: 'Abra', 17: 'Doduo', 18: 'Dodrio' }
    }
  },
  methods: {
    getDualData(data) {
      this.output = Object.assign({}, data)
    }
  },

  render(h) {
    const labels = {
      1: 'Squirtle',
      2: 'Caterpie',
      3: 'Raticate',
      4: 'Fearow',
      5: 'Clefairy',
      6: 'Venonat',
      7: 'Psyduck',
      8: 'Eevee',
      9: 'Mew',
      10: 'Pikachu',
      11: 'Golduck',
      12: 'Vulpix',
      13: 'Mewtwo',
      14: 'Raichu'
    }
    const selectedLabel = {
      15: 'Meowth',
      16: 'Abra',
      17: 'Doduo',
      18: 'Dodrio'
    }
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div class={[s.code]}>
          <pre>
            <code>
              {JSON.stringify(this.output, null, 2)}
            </code>
          </pre>
        </div>
        <Dual.Group items={labels} selectedItems={selectedLabel} class={[s.dualGroup]} onChange={this.getDualData} />
      </div>
    )
  }
}

module.exports = DualListBoxPage
