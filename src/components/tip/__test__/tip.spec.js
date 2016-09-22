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
    }
  })
  expect(vm.pos).toBe('down')
  expect(vm.event).toBe('mouseenter')
})

it('test Tip props set `pos`=right and mouse event', async() => {
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
    }
  })
  expect(vm.pos).toBe('right')
  //when mouse enters
  const eventEnter = document.createEvent('HTMLEvents')
  eventEnter.initEvent('mouseenter', true, false)
  vm.$el.dispatchEvent(eventEnter)
  //tipContext should show up
  const tipContext2 = document.querySelector('#tipContext2')
  expect(getComputedStyle(tipContext2)._values.display).toBe('block')
  await new Promise((done) => {
    setTimeout(() => {
      done()
    }, 50)
  })
  expect(getComputedStyle(tipContext2)._values.opacity).toBe('1')
  //when mouse leaves
  const eventLeave = document.createEvent('HTMLEvents')
  eventLeave.initEvent('mouseleave', true, false)
  vm.$el.dispatchEvent(eventLeave)
  //tipContext should disappear
  expect(document.querySelector('#tipContext2')).toBe(null)
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
    }
  })
  expect(vm.pos).toBe('left')

  const eventEnter = document.createEvent('HTMLEvents')
  eventEnter.initEvent('mouseenter', true, false)
  vm.$el.dispatchEvent(eventEnter)
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
    }
  })
  expect(vm.pos).toBe('up')

  const eventEnter = document.createEvent('HTMLEvents')
  eventEnter.initEvent('mouseenter', true, false)
  vm.$el.dispatchEvent(eventEnter)
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
    }
  })
  expect(vm.pos).toBe('down')

  const eventEnter = document.createEvent('HTMLEvents')
  eventEnter.initEvent('mouseenter', true, false)
  vm.$el.dispatchEvent(eventEnter)
})
