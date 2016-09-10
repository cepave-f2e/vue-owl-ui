import s from './select.scss'

const Select = {
  name: 'Select',
  render(h) {
    const {$slots} = this
    return (
      <div class={[s.body]}>
        This is Select component
      </div>
    )
  }
}

module.exports = Select
