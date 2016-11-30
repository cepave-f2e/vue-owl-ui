import Tab from '../'

it('test <Tab> with props `name` and `isSelected`', () => {
  const vm = shallow({
    render(h) {
      return (
        <Tab>
          <Tab.Head slot="tabHead" name="1" isSelected={true}>Tab1</Tab.Head>
          <Tab.Head slot="tabHead" name="2">Tab2</Tab.Head>
          <Tab.Content slot="tabContent" name="1">
            <br />Hello, I am tab one
          </Tab.Content>
          <Tab.Content slot="tabContent" name="2">
            <br />This is tab two
          </Tab.Content>
        </Tab>
      )
    }
  })
  expect(vm.$children[0].name).toBe('1')
  expect(vm.$children[1].name).toBe('2')
  expect(vm.$children[2].name).toBe('1')
  expect(vm.$children[3].name).toBe('2')
  expect(vm.$children[0].selected).toBe('1')
  expect(vm.$children[1].selected).toBe('0')
  expect(vm.$children[2].isSelected).toBe(true)
  expect(vm.$children[3].isSelected).toBe(false)
})

it('click on <Tab.Head> to switch <Tab.Content>', async() => {
  let tabData
  const getTabData = (data) => {
    tabData = data
  }
  let vm
  await new Promise((done) => {
    vm = shallow({
      render(h) {
        return (
          <Tab onChange={getTabData}>
            <Tab.Head slot="tabHead" name="1">Tab1</Tab.Head>
            <Tab.Head slot="tabHead" name="2" isSelected={true}>Tab2</Tab.Head>
            <Tab.Content slot="tabContent" name="1">
              <br />Hello, I am tab one
            </Tab.Content>
            <Tab.Content slot="tabContent" name="2">
              <br />This is tab two
            </Tab.Content>
          </Tab>
        )
      }
    })
    expect(vm.$children[0].selected).toBe('0')
    expect(vm.$children[1].selected).toBe('1')
    //click on Tab.Head "2"
    $(vm.$children[1].$el).trigger('click')
    expect(vm.$children[0].selected).toBe('0')
    expect(vm.$children[1].selected).toBe('1')
    //click on Tab.Head "1"
    $(vm.$children[0].$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(tabData).toEqual({
    idx: 0,
    name: '1'
  })
  expect(vm.$children[0].selected).toBe('1')
  expect(vm.$children[1].selected).toBe('0')
  expect(vm.$children[2].isSelected).toBe(true)
  expect(vm.$children[3].isSelected).toBe(false)
})
