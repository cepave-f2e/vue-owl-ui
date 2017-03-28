import Markdown from '../../components/markdown'

const LegacyDoc = {
  name: 'LegacyDoc',
  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
      </div>
    )
  },
}
module.exports = LegacyDoc
