import Page from '~com/page'
import MarkDown from '../../components/markdown'
const PageDoc = {
  name: 'PageDoc',
  render(h) {
    return (
      <div>
        <MarkDown src={require('./doc.md')} />
        <h3>typ="pages"</h3>
        <Page total={500} limit={20} align="left" />
        <h3>typ="number"</h3>
        <Page total={500} limit={20} typ="number" align="left" />
      </div>
    )
  }
}

module.exports = PageDoc
