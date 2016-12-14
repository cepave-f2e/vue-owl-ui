import Input from '../../../components/input'
import Markdown from '../../components/markdown'
import s from './input.scss'

const InputPage = {
  name: 'InputPage',
  data() {
    return {
      outputs: ''
    }
  },
  mounted() {
    this.$on('handleClickOnX', this.handleClickOnX)
  },
  methods: {
    handleSubmit(e) {
      this.outputs = this.$refs.inputRef.value
    },
    handleClickOnX(data) {
      this.outputs = this.$refs.inputRef.value
    }
  },
  render(h) {
    return (
      <div>
        <Markdown src={require('./doc.md')} />
        <div class={[s.wrapper]}>
          <Input name="demo" icon={['search', '#919799']} status="normal" placeholder="type some words.." ref="inputRef" />
          <div on-click={this.handleSubmit} class={[s.submit]}>Submit</div>
          <div class={[s.demo]}>demo : { this.outputs }</div>
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input loading={true} />
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input password={true} />
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input x={true} />
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input val="cepave" status="success" />
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input status="error" />
        </div>
        <div class={[s.pwdInputwrapper]}>
          <Input required={true} />
        </div>
      </div>
    )
  }
}

module.exports = InputPage
