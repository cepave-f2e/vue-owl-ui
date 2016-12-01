const CompnentHomePage = {
  name: 'CompnentHomePage',
  data() {
    return {
      loading: true,
      owlSrc: '',
    }
  },

  methods: {
    renderImg(src) {
      const img = new Image()
      img.src = src

      img.onload = () => {
        this.owlSrc = src
        this.loading = false
      }
    }
  },

  mounted() {
    const { renderImg } = this
    const date = new Date().getDate()

    if (+localStorage.__owlDate === date) {
      renderImg(localStorage.__owlSrc)
    } else {
      const owl = owlSrcs[Math.floor(Math.random() * owlSrcs.length)]
      renderImg(owl.src)

      localStorage.__owlDate = date
      localStorage.__owlSrc = owl.src
    }

    return

    axios({
      url: 'https://api.cognitive.microsoft.com/bing/v5.0/images/search',
      params: {
        q: 'owl',
        count: 150,
        offset: Math.floor(Math.random() * 1000),
      },
      headers: { 'Ocp-Apim-Subscription-Key': '' }
    })
    .then((res) => {
      const owlsrcs = res.data.value.map((owl) => {
        const [r] = decodeURIComponent(owl.contentUrl).match(/r=http[^&]+/)

        return {
          thumb: owl.thumbnailUrl,
          src: r.replace(/^r=https?:/, ''),
          width: owl.width,
          height: owl.height,
        }
      })
    })
  },
  render(h) {
    const { $slots } = this
    return (
      <div>
        Components
      </div>
    )
  }
}

module.exports = CompnentHomePage
