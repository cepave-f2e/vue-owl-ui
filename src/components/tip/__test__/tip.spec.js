import Tip from '../'

it('test Tip default porps', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tip>
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })
  expect(vm.pos).toBe('down')
  expect(vm.event).toBe('mouseenter')
})

it('test mouse hover event', async() => {
  const vm = shallow({
    render(h) {
      return (
        <Tip>
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })

  // when mouse enters
  $(vm.$el).trigger('mouseenter')
  // tipContext should show up
  const tipContext2 = document.querySelector('#tipContext2')
  expect(getComputedStyle(tipContext2)._values.display).toBe('block')
  await new Promise((done) => {
    setTimeout(() => {
      done()
    }, 50)
  })
  expect(getComputedStyle(tipContext2)._values.opacity).toBe('1')
  // when mouse leaves
  $(vm.$el).trigger('mouseleave')
  // tipContext should disappear
  expect(document.querySelector('#tipContext2')).toBe(null)
})

it('test Tip props set `pos`=right', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tip pos="right">
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })
  expect(vm.pos).toBe('right')

  $(vm.$el).trigger('mouseenter')
})

it('test Tip props set `pos`=left', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tip pos="left">
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })
  expect(vm.pos).toBe('left')

  $(vm.$el).trigger('mouseenter')
})

it('test Tip props set `pos`=up', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tip pos="up">
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })
  expect(vm.pos).toBe('up')

  $(vm.$el).trigger('mouseenter')
})

it('test Tip props set `pos`=down', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tip pos="down">
          tip
          <Tip.Context>
            tipContext
          </Tip.Context>
        </Tip>
      )
    },
  })
  expect(vm.pos).toBe('down')

  $(vm.$el).trigger('mouseenter')
})
