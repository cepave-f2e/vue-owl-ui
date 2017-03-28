import Markdown from '../../../components/markdown'
import Legacy from '~com/legacy'

const LegacyGridDoc = {
  name: 'LegacyGridDoc',
  data() {
    const h = this.$createElement
    return {
      gridProps: {
        heads: [
          {
            col: <b>Name</b>,
            width: '50%',
          },
          {
            col: 'HP',
            width: '50%',
          },
        ],
        rows: [
          [
            { col: 'Pikachu' },
            { col: 13 },
          ],
        ],
      },
    }
  },
  render(h) {
    const { gridProps } = this

    return (
      <div>
        <Markdown src={require('./doc.md')} />

        <Legacy.Grid {...{ props: gridProps }} />
      </div>
    )
  },
}
module.exports = LegacyGridDoc
