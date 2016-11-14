import Button from '../'

it('set `status`, `content` and  `icon` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Button status="primary">cepave</Button>
      )
    }
  })

  expect(vm.style[0]).toContain('button')
  expect(vm.style[1]).toContain('primary')
})

it('set `disabled` props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Button disabled={true}>cepave</Button>
      )
    }
  })

  expect(vm.style[0]).toContain('button')
  expect(vm.style[1]).toContain('disabled')
})
