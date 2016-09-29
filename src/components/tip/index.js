import s from './tip.scss'
const offset = (el) => {
  let top = 0, left = 0

  while (el) {
    top += el.offsetTop
    left += el.offsetLeft

    el = el.offsetParent
  }

  return { top, left }
}

const Tip = {
  name: 'Tip',
  props: {
    pos: {
      type: String,
      default: 'down',
    },

    event: {
      type: String,
      default: 'mouseenter'
    },
  },

  mounted() {
    const { event, $el, pos, $children } = this
    const _body = document.body
    const _context = $children[0].$el.cloneNode(true)
    _context.style.display = 'block'
    _context.setAttribute('id', 'tipContext2')
    // _context.dataset.pos = pos

    $el.addEventListener(event, (ev)=> {
      _body.appendChild(_context)
      const { currentTarget } = ev
      const { left, top } = offset(currentTarget)
      const oWidth = currentTarget.offsetWidth
      const oHeight = currentTarget.offsetHeight
      const cWidth = _context.offsetWidth
      const cHeight = _context.offsetHeight

      if (pos === 'down') {
        _context.style.left = `${left + oWidth / 2 - cWidth / 2}px`
        _context.style.top = `${top + oHeight + 10}px`
      } else if (pos === 'up') {
        _context.style.left = `${left + oWidth / 2 - cWidth / 2}px`
        _context.style.top = `${top - oHeight - 10}px`
      } else if (pos === 'left') {
        _context.style.left = `${left - cWidth - 10}px`
        _context.style.top = `${top + oHeight / 2 - cHeight / 2}px`
      } else if (pos === 'right') {
        _context.style.left = `${left + oWidth + 10}px`
        _context.style.top = `${top + oHeight / 2 - cHeight / 2}px`
      }

      setTimeout(()=> {
        _context.style.transition = 'all .4s'
        _context.style.opacity = 1
      }, 50)
    }, false)

    $el.addEventListener('mouseleave', (ev)=> {
      _context.style.opacity = 0
      _body.removeChild(_context)
    }, false)
  },

  render(h) {
    const { pos, $slots } = this
    return (
      <div class={[s.tip2]} data-pos={pos}>
        {$slots.default}
        {$slots.context}
      </div>
    )
  },
}

Tip.Context = {
  name: 'TipContext',
  props: {
    width: {
      type: [String, Number],
      default: 'auto'
    }
  },

  computed: {
    setWidth() {
      const { width } = this

      return {
        width: `${width}px`
      }
    }
  },

  render(h) {
    const { $slots, setWidth } = this
    return (
      <div class={[s.tipContext2]} slot="context" style={setWidth}>
        {$slots.default}
      </div>
    )
  }
}

module.exports = Tip
