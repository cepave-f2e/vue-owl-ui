import Switch from '../'

it('default status should be checked', () => {
  const vm = render((h)=> {
    return (
      <Switch checked={true}/>
    )
  })
  expect(vm.check).toBe(true)
})

it('status and output data should be changed to `false` after one click', () => {
  const switchChange = (data) => {
    expect(Object.values(data)[0]).toBe(false)
  }
  const vm = render((h) => {
    return (
      <Switch checked={true} onChange={switchChange}/>
    )
  })
  vm.handleClick()
  expect(vm.check).toBe(false)
})
