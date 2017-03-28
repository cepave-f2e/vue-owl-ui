import Loading from '../'

it('test <Loading /> default `typ` and `show`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Loading />
      )
    },
  })
  expect(vm.typ).toBe('pie')
  expect(vm.show).toBe(true)
})

it('test <Loading /> props `typ` and `show`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Loading typ="bar" show={false} />
      )
    },
  })
  expect(vm.style.width).toBe('100px')
  expect(vm.style.height).toBe('10px')
  expect(vm.style.display).toBe('none')
})

it('test Loading Pie with props `size`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Loading typ="pie" size="20" />
      )
    },
  })
  expect(vm.style.borderWidth).toBe('20px')
})

it('test Loading bar with props `size`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Loading typ="bar" size="200x20" />
      )
    },
  })
  expect(vm.style.width).toBe('200px')
  expect(vm.style.height).toBe('20px')
})
