import Dual from '../../../components/dualListbox'
import Markdown from '../../components/markdown'
import s from './duallistbox.scss'

const DualListBoxPage = {
  name: 'DualListBoxPage',
  methods: {
    getDualData(data) {
      console.log(data)
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
        <Dual.Group items={labels} selectedItems={selectedLabel} class={[s.dualGroup]} onChange={this.getDualData} />
      </div>
    )
  }
}

module.exports = DualListBoxPage
