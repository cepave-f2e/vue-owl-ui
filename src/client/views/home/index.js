import Select from '../../../components/select'
import Markdown from '../../components/markdown'

const Home = {
  name: 'Home',

  render(h) {
    const { $slots } = this

    return (
      <div>
        <Markdown src={require('./doc.md')} opts={{ codeTheme: 'light' }} />
        <Select />
      </div>
    )
  }
}

module.exports = Home
