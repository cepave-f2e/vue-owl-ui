import Switch from '../'

it('default status should be checked', () => {
  const vm = shallow({
    render(h) {
      return (
        <Switch checked={true}/>
      )
    }
  })
  expect(vm.check).toBe(true)
})

it('status and output data should be changed to `false` after one click', async() => {
  const switchChange = (data) => {
    expect(Object.values(data)[0]).toBe(false)
  }
  const vm = shallow({
    render(h) {
      return (
        <Switch checked={true} onChange={switchChange}/>
      )
    }
  })
  vm.handleClick()
  await new Promise((done) => {
    vm.$nextTick(done)
  })
  expect(vm.check).toBe(false)
})

it('`check` should be changed after dynamic updates', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data: {
        input : true
      },
      mounted() {
        this.input = false
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Switch checked={this.input} />
        )
      }
    })
  })
  expect(vm.check).toBe(false)
})
