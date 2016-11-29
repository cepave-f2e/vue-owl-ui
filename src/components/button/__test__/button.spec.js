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

it('test <Button.Group> with props `options`', () => {
  const options = [
    { value: 'winnie', title: 'Winnie The Pooh' },
    { value: 'piglet', title: 'Piglet' },
    { value: 'tigger', title: 'Tigger', selected: true }
  ]
  const getButtonGroupData = (data) => {}
  const vm = shallow({
    render(h) {
      return (
        <Button.Group options={options} onChange={getButtonGroupData} />
      )
    }
  })
  expect(vm.buttonOptions).toEqual([
    { value: 'winnie', title: 'Winnie The Pooh' },
    { value: 'piglet', title: 'Piglet' },
    { value: 'tigger', title: 'Tigger', selected: true }
  ])
  expect(vm.selectedIdx).toBe(2)
})

it('click on <Button.Group> to switch chosen option', async() => {
  let vm
  const options = [
    { value: 'winnie', title: 'Winnie The Pooh' },
    { value: 'piglet', title: 'Piglet' },
    { value: 'tigger', title: 'Tigger', selected: true }
  ]
  const getButtonGroupData = (data) => {}
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Button.Group options={options} onChange={getButtonGroupData} />
        )
      }
    })
    $(vm.$children[2].$el).trigger('click')
    expect(vm.selectedIdx).toBe(2)
    expect(vm.buttonOptions).toEqual([
      { value: 'winnie', title: 'Winnie The Pooh' },
      { value: 'piglet', title: 'Piglet' },
      { value: 'tigger', title: 'Tigger', selected: true }
    ])
    $(vm.$children[0].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.selectedIdx).toBe(0)
  expect(vm.buttonOptions).toEqual([
    { value: 'winnie', title: 'Winnie The Pooh', selected: true },
    { value: 'piglet', title: 'Piglet', selected: false },
    { value: 'tigger', title: 'Tigger', selected: false }
  ])
})
