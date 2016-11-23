import Input from '../'

it('test <Input /> default props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Input name="demo" icon={['grid-4', '#e6175c']} status="normal" placeholder="demo" />
      )
    }
  })
  expect(vm.name).toBe('demo')
  expect(vm.icon).toEqual(['grid-4', '#e6175c'])
  expect(vm.status).toBe('normal')
  expect(vm.placeholder).toBe('demo')
  // clicking on the icon should not empty vm.value
  $(vm.$children[1].$el).trigger('click')
})

it('test <Input /> get data from calling `value`', () => {
  const vm = shallow({
    render(h) {
      return (
          <Input name="demo" loading={true} status="normal" ref="demo" />
      )
    }
  })
  $(vm.$refs.demo).val('cepave')
  vm.handleInput()
  expect(vm.value).toBe('cepave')
})

it('test <Input /> of password mode', () => {
  const vm = shallow({
    render(h) {
      return (
        <Input password={true} />
      )
    }
  })
  expect(vm.pwdFill).toBe('#b8bdbf')
  expect(vm.pwdInput).toBe('password')
  // click on the icon - `eye`
  $(vm.$children[1].$el).trigger('click')
  expect(vm.pwdFill).toBe('#8962d9')
  expect(vm.pwdInput).toBe('text')
  // click on the icon - `eye` again
  $(vm.$children[1].$el).trigger('click')
  expect(vm.pwdFill).toBe('#b8bdbf')
  expect(vm.pwdInput).toBe('password')
})

it('test <Input /> with a `x` icon', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Input name="demo" ref="demo" x={true} />
        )
      }
    })

    $(vm.$refs.demo).val('cepave')
    vm.handleInput()
    expect(vm.value).toBe('cepave')
    expect(vm.showX).toBe(true)
    vm.$nextTick(done)
  })
  // click on the icon - `x`
  $(vm.$children[1].$el).trigger('click')
  expect(vm.value).toBe('')
})
