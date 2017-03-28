import delegate from 'delegate-to'
import s from './grid.scss'
import Loading from '../loading'

const unit = (u) => {
  u = String(u)
  if (!u.includes('%')) {
    u = `${u}px`
  }
  return u
}

const Grid = {
  name: 'Grid',

  props: {
    heads: {
      type: Array,
      required: true,
      default: () => [
        {
          name: 'Head',
          key: '',
          sort: -1,
          sortKey: '',
          width: '20%',
        },
      ],
    },

    rows: {
      type: Array,
      default: () => [],
    },

    rowsRender: {
      type: Function,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    rows(newRows) {
      this.heads.forEach(head => {
        if (head.sort !== undefined) {
          head.sort = -1
        }
      })
      this.drows = Array.from(newRows)
    },
  },

  data() {
    this._createID = `owl-ui-grid_${Date.now()}`

    const { rows } = this
    return {
      updating: true,
      drows: Array.from(rows),
    }
  },

  mounted() {
    const { widths, $el, _createID } = this
    const style = document.createElement('style')
    style.textContent = widths.map((width, i) => {
      return `#${_createID} [data-role="row"] [data-role="col"]:nth-of-type(${i + 1}) {
          width: ${width}
      }`
    }).join('')

    $el.appendChild(style)
  },

  computed: {
    widths() {
      const { heads } = this

      return heads.map(head => unit(head.width))
    },
  },

  methods: {
    renderRows({ row }) {
      const h = this.$createElement
      const { heads } = this

      return heads.map((head, idx) => {
        return (
          <div data-role="col">
            {row[head.key]}
          </div>
        )
      })
    },

    sorting: delegate('[data-sort]', function (ev) {
      const { delegateTarget } = ev
      const idx = delegateTarget.getAttribute('data-idx')
      const { drows, heads } = this
      const { sort, key, sortKey } = heads[idx]

      if (sort !== -1) {
        heads[idx].sort = (1 - sort)

        if (this._events.sort) {
          this.$emit('sort', {
            sort: heads[idx].sort,
            key,
          })
        } else {
          drows.reverse()
        }
      } else {
        heads.forEach(head => {
          if (head.sort !== undefined) {
            head.sort = -1
          }
        })
        heads[idx].sort = 1

        if (this._events.sort) {
          this.$emit('sort', {
            sort: heads[idx].sort,
            key,
          })
        } else {
          drows.sort((a, b) => {
            a = a[sortKey || key]
            b = b[sortKey || key]

            if (typeof a === 'number' && typeof b === 'number') {
              return b - a
            } else {
              return b.localeCompare(a)
            }
          })
        }
      }
    }),
  },

  render(h) {
    const { sorting, heads, drows, rowsRender, renderRows, _createID, loading } = this

    return (
      <div class={[s.gridFixed]} id={_createID}>
        <div class={[s.ghead]} on-click={sorting}>
          <div data-role="row">
            {heads.map((head, i) => {
              return (
                <div data-role="col" data-idx={i} data-sort={head.sort}>
                  { head.name }
                </div>
              )
            })}
          </div>
        </div>

        <div class={[s.gbody]}>
          {
            loading
              ? <div class={[s.loading]}>
                  <Loading />
                </div>
              : null
          }
          {drows.map((row, index) => {
            return (
              <div data-role="row">
                { rowsRender
                  ? rowsRender({ row, index })
                  : renderRows({ row, index })
                }
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}

Grid.Col = {
  name: 'GridCol',
  props: {
    width: {
      type: [String, Number],
      default: '',
    },
  },

  computed: {
    style() {
      const { width } = this

      return {
        width: unit(width),
      }
    },
  },

  render(h) {
    const { $slots, style } = this

    return (
      <div data-role="col" style={style}>
        {$slots.default}
      </div>
    )
  },
}

module.exports = Grid
