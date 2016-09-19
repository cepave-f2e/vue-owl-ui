const Router = {
  name: 'Router',
  props: {
    to: {
      type: String,
      default: '/'
    }
  },

  methods: {
    routeTo(ev) {
      ev.preventDefault()
      const { currentTarget } = ev
      const to = currentTarget.getAttribute('href')
      this.$router.push(to)
    }
  },

  render(h) {
    const { $slots, to, routeTo } = this
    return (
      <a href={to} on-click={routeTo}>
        { $slots.default }
      </a>
    )
  }
}

module.exports = Router

