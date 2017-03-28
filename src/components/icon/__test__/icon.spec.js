import Icon from '../'

it('set `typ` and `size` props', ()=> {
  const vm = shallow({
    render(h) {
      return (
        <Icon typ="xyz" size={100} />
      )
    },
  })

  expect(vm.typ).toBe('xyz')
  expect(vm.$el.getAttribute('width')).toBe('100')
  expect(vm.$el.getAttribute('height')).toBe('100')
})

it('set `size` as string', ()=> {
  const vm = shallow({
    render(h) {
      return (
        <Icon typ="xyz" size={'100x10'} />
      )
    },
  })

  expect(vm.$el.getAttribute('width')).toBe('100')
  expect(vm.$el.getAttribute('height')).toBe('10')
})
