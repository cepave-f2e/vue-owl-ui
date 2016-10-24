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
  $(vm.$el).trigger('click')
})

it('test props `name`, status, and output data after one clicking', () => {
  const switchChange = (data) => {
    expect(data).toEqual({ test: false })
  }
  const vm = shallow({
    render(h) {
      return (
        <Switch name="test" checked={true} onChange={switchChange}/>
      )
    }
  })
  $(vm.$el).trigger('click')
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
