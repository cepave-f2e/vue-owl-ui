import Input from '../'

it('test <Input/> default props', () => {
  const vm = shallow({
    render(h) {
      return (
        <Input name="demo" icon={['grid-4', '#e6175c']} status="normal" placeholder="demo"/>
      )
    }
  })
  expect(vm.name).toBe('demo')
  expect(vm.icon).toEqual(['grid-4', '#e6175c'])
  expect(vm.status).toBe('normal')
  expect(vm.placeholder).toBe('demo')
})

it('test <Input/> get data from calling `value`', () => {
  const vm = shallow({
    render(h) {
      return (
          <Input name="demo" loading={true} status="normal" ref="demo"/>
      )
    }
  })
  $(vm.$refs.demo).val('cepave')
  expect(vm.value).toEqual({ demo: 'cepave' })
})
