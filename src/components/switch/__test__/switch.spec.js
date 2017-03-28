import Switch from '../'
import s from '../switch.scss'

it('default status should be checked', () => {
  const vm = shallow({
    render(h) {
      return (
        <Switch checked={true} />
      )
    },
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
        <Switch name="test" checked={true} onChange={switchChange} />
      )
    },
  })
  $(vm.$el).trigger('click')
  expect(vm.check).toBe(false)
})

it('`check` should be changed after dynamic updates', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      data: {
        input : true,
      },
      mounted() {
        this.input = false
        this.$nextTick(done)
      },
      render(h) {
        return (
          <Switch checked={this.input} />
        )
      },
    })
  })
  expect(vm.check).toBe(false)
})

it('test props `typ` and add words in switch button', () => {
  const getSwitchData = (data) => {}
  const vm = shallow({
    render(h) {
      return (
        <Switch checked={true} name="test" typ="special" onChange={getSwitchData}>
          <Switch.Open>開</Switch.Open>
          <Switch.Close>關</Switch.Close>
        </Switch>
      )
    },
  })
  expect(vm.style).toEqual({
    checkbox: [s.specialSwitchButton],
    div: [s.specialSwitch],
  })
})
