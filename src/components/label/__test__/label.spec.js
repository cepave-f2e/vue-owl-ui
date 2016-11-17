import Label from '../'

it('test default <Label>', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label>Default</Label>
      )
    }
  })
  expect(vm.style[0]).toContain('label')
})

it('test <Label> with props `typ` and `status`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label typ="outline" status="primary">Primary</Label>
      )
    }
  })
  expect(vm.style[0]).toContain('label')
  expect(vm.style[1]).toContain('outline')
  expect(vm.style[2]).toContain('primary')
})

it('test <Label> with props `badge`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Label badge={true} typ="outline" status="primary">Primary</Label>
      )
    }
  })
  expect(vm.style[0]).toContain('label')
  expect(vm.style[1]).toContain('outline')
  expect(vm.style[2]).toContain('primary')
  expect(vm.style[3]).toContain('badge')
})
