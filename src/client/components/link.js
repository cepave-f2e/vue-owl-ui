const Link = {
  name: 'Link',
  functional: true,
  render(h, { data, children }) {
    return (
      <router-link exact {...data} >{ children }</router-link>
    )
  },
}

module.exports = Link
