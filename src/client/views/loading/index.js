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
        <h2>typ="pie"</h2>
        <div class={[s.exampleWrapper]}>
          <Loading />
        </div>
        <h2>typ="bar"</h2>
        <div class={[s.exampleWrapper]}>
          <Loading typ="bar"  />
        </div>
      </div>
    )
  },
}

module.exports = LoadingPage
