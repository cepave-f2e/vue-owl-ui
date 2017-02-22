import Table from '../../../components/table'
import Markdown from '../../components/markdown'
import s from './table.scss'

const TablePage = {
  name: 'TablePage',

  data() {
    return {
      tableData: {
        heads: [
          {
            col: 'pokemon',
            width: '25%'
          },
          {
            col: 'chinese_name',
            width: '25%'
          },
          {
            col: 'type',
            width: '25%'
          },
          {
            col: 'attack',
            width: '25%'
          }
        ],
        rows: [
          {
            pokemon: 'Bulbasaur',
            chinese_name: '妙蛙種子',
            type: 'Grass Poison',
            attack: '35'
          },
          {
            pokemon: 'Charmander',
            chinese_name: '小火龍',
            type: 'Fire',
            attack: '35'
          },
          {
            pokemon: 'Squirtle',
            chinese_name: '傑尼龜',
            type: 'Water',
            attack: '35'
          },
          {
            pokemon: 'Pikachu',
            chinese_name: '皮卡丘',
            type: 'Electric',
            attack: '50'
          }
        ],
        feet: [
          {
            val: 'total',
            colspan: '3'
          },
          {
            val: '155',
            colspan: '1'
          }
        ]
      }
    }
  },

  render(h) {
    const { tableData } = this
    const props = {
      ...tableData
    }
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div class={[s.tableName]}>base</div>
        <Table {...{ props }} class={[s.table]} />
        <div class={[s.tableName]}>bordered</div>
        <Table {...{ props }} typ="bordered" class={[s.table]} />
        <div class={[s.tableName]}>striped</div>
        <Table {...{ props }} typ="striped" class={[s.table]} />
        <div class={[s.tableName]}>flat</div>
        <Table {...{ props }} typ="flat" class={[s.table]} />
      </div>
    )
  }
}
module.exports = TablePage
