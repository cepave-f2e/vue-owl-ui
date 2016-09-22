import Select from '../'

it('Test <Select /> default `foo`', ()=> {
  const vm = shallow({
    render(h) {
      return (
        <Select />
      )
    }
  })

  expect(vm.foo).toBe(1)
})

it('Test <Select /> `handleClick`', async()=> {
  const vm = shallow({
    render(h) {
      return (
        <Select />
      )
    }
  })

  vm.handleClick()
  await new Promise((done)=> {
    vm.$nextTick(done)
  })
  expect(vm.foo).toBe(100)
})

it('Test <Select /> props `name` and `age`', ()=> {
  const vm = shallow({
    render(h) {
      return (
        <Select name="Jimy" age={20} />
      )
    }
  })

  expect(vm.name).toBe('Jimy')
  expect(vm.age).toBe(20)
})

it('Test <Select /> dynamic updates', async()=> {
  let vm
  await new Promise((done)=> {
    vm = shallow({
      data: {
        checked: false
      },

      mounted() {
        this.checked = true
        this.$nextTick(done)
      },

      render(h) {
        return (
          <Select checked={this.checked} />
        )
      }
    })
  })
})
