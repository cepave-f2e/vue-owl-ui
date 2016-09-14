import Select from '../'

it('Test <Select /> default `foo`', ()=> {
  const vm = render((h)=> {
    return (
      <Select />
    )
  })

  expect(vm.foo).toBe(1)
})

it('Test <Select /> `handleClick`', ()=> {
  const vm = render((h)=> {
    return (
      <Select />
    )
  })

  vm.handleClick()
  expect(vm.foo).toBe(100)
})


it('Test <Select /> props `name` and `age`', ()=> {
  const vm = render((h)=> {
    return (
      <Select name="Jimy" age={300} />
    )
  })

  expect(vm.name).toBe('Jimy')
  expect(vm.age).toBe(300)
})
