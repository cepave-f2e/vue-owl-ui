import s from './select.scss'

const Select = {
  name: 'Select',

  props: {
    name: '',
    age: 0,
  },

  data() {
    return {
      foo: 1,
    }
  },

  methods: {
    handleClick() {
      this.foo = 100
    }
  },

  render(h) {
    const { $slots, foo } = this
    return (
      <div class={[s.body]}>
        This is Select component
        <div data-foo={foo}></div>
      </div>
    )
  }
}

module.exports = Select
