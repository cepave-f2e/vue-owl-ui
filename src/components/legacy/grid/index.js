import delegate from 'delegate-to'
import s from './grid.scss'

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
      default:() => [],
    },

    rows: {
      type: Array,
      default:() => [],
    },

    rowsRender: {
      type: Function,
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
    sorting: delegate('[data-sort]', function (ev) {
      const { idx } = ev.delegateTarget.dataset
      const { drows, heads } = this
      const sort = +heads[idx].sort

      if (sort !== -1) {
        drows.reverse()
        heads[idx].sort = (sort === 1 ? 0 : 1)
      } else {
        heads.forEach(head => {
          if (head.sort !== undefined) {
            head.sort = -1
          }
        })
        heads[idx].sort = 1

        drows.sort((a, b) => {
          a = a[idx].col
          b = b[idx].col

          if (typeof a === 'number' && typeof b === 'number') {
            return a - b
          } else {
            return a.localeCompare(b)
          }
        })
      }
    }),
  },

  render(h) {
    const { sorting, heads, drows, rowsRender, _createID } = this

    return (
      <div class={[s.gridFixed]} id={_createID}>
        <div class={[s.ghead]} on-click={sorting}>
          <div data-role="row">
            {heads.map((head, i) => {
              return (
                <div data-role="col" data-idx={i} data-sort={head.sort}>
                  {head.render ? head.render(h, head) : head.col}
                </div>
              )
            })}
          </div>
        </div>

        <div class={[s.gbody]}>
          {drows.map((row, index) => {
            return (
              <div data-role="row">
                { rowsRender
                  ? rowsRender(h, { row, index })
                  : row.map((col, i) => {
                    return (
                      <div data-role="col" data-idx={i}>
                        {col.render ? col.render(h, col) : col.col}
                      </div>
                    )
                  })
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
