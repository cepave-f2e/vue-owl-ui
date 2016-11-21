import Loading from '../../../components/loading'
import Markdown from '../../components/markdown'
import s from './loading.scss'

const LoadingPage = {
  name: 'LoadingPage',

  render(h) {
    const { $slots } = this

    return (
      <div>
        <Markdown src={require('./loading.md')} />
        <div class={[s.exampleWrapper]}>
          <Loading class={[s.examplePie]} />
        </div>
      </div>
    )
  }
}

module.exports = LoadingPage
