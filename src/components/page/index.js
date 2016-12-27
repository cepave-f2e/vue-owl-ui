import s from './page.scss'
import delegate from 'delegate-to'

const Page = {
  name: 'Page',
  props: {
    limit: {
      type: Number,
      default: 10,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    typ: {
      type: String,
      default: 'pages', // `pages`, `button`, `text` and `number`
    },

    align: {
      type: String,
      default: 'center' // `left`, `center` or `right`
    },

    toPage: {
      type: Number,
      default: 1,
    }
  },

  data() {
    return {
      page: this.toPage
    }
  },

  watch: {
    toPage(p) {
      this.page = p
    }
  },

  methods: {
    jumpTo: delegate('li', function (ev) {
      const { delegateTarget } = ev
      let page = delegateTarget.getAttribute('data-page')

      page = +page || page

      if (this.page === page || page === '...' || !page) {
        return
      }

      if (page === 'next') {
        this.page += 1
      } else if (page === 'prev') {
        this.page -= 1
      } else {
        this.page = page
      }

      this.$emit('page', {
        page
      })
    })
  },

  computed: {
    totalPages() {
      const { total, limit } = this

      return Math.ceil(total / limit)
    },

    pageData() {
      const keep = 5

      const mid = Math.floor(keep / 2)
      const range = keep - 1

      return { mid, range }
    },

    pageLists() {
      const { page, $createElement, totalPages, pageData } = this
      const pagesVNodes = [], h = $createElement

      const start = Math.max(1, page - pageData.mid)
      const end = Math.min(page + pageData.mid, totalPages)

      const hasStartSpread = start > 1
      const hasEndSpread = end <= totalPages - 1

      for (let i = start; i <= end; i++) {
        const css = {
          [s.on]: (i === page)
        }
        pagesVNodes.push(
          <li data-page={i} class={[css]} data-role="page" />
        )
      }

      return {
        pagesVNodes,
        hasStartSpread,
        hasEndSpread,
      }
    },

    typeRender() {
      const { typ, page, pageLists, totalPages, $createElement } = this
      const h = $createElement
      let VNode =
        <ol>
          <li data-page="prev" class={[s.prev]} hidden={page <= 1} />
          <li data-page="1" hidden={!pageLists.hasStartSpread} />
          <li data-page="..." hidden={!pageLists.hasStartSpread} />
          { pageLists.pagesVNodes }
          <li data-page="..." hidden={!pageLists.hasEndSpread} />
          <li data-page={totalPages} hidden={!pageLists.hasEndSpread} />
          <li data-page="next" class={[s.next]} hidden={page >= totalPages} />
        </ol>

      if (typ === 'number') {
        VNode =
          <ol>
            <li data-page="prev" class={[s.prev]} hidden={page <= 1} />
            <li>
              {page} of {totalPages}
            </li>
            <li data-page="next" class={[s.next]} hidden={page >= totalPages} />
          </ol>
      }
      return VNode
    }
  },

  render(h) {
    const { jumpTo,  align, typeRender } = this

    return (
      <nav class={[s.page]} data-align={align} onClick={jumpTo}>
        { typeRender }
      </nav>
    )
  }
}

module.exports = Page
