import LightBox from '../'
import s from '../lightbox.scss'

it(`Test LightBox children's \`data-role\``, () => {
  const vm = shallow({
    render(h) {
      return (
        <LightBox>
          <LightBox.Open />
          <LightBox.View>
            <div>
              <LightBox.Close />
            </div>
          </LightBox.View>
        </LightBox>
      )
    },
  })

  const [open, view] = vm.$children

  expect($(open.$el).attr('data-role')).toBe('lb-open')
  expect($(view.$el).attr('data-role')).toBe('lb-view')
})

it('Test LightBox triggers `Open` and `Close`', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      mounted() {
        $(this.$el).find(`[data-role="lb-open"]`).trigger('click')

        this.$nextTick(done)
      },
      render(h) {
        return (
          <LightBox >
            <LightBox.Open />
            <LightBox.View>
              <div>
                <LightBox.Close>close</LightBox.Close>
              </div>
            </LightBox.View>
          </LightBox>
        )
      },
    })
  })

  expect(vm.opened).toBe(true)

  const [open, view] = vm.$children

  await new Promise((done) => {
    $(view.$el).find(`.${s.x}`).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.opened).toBe(false)
})

it('Test LightBox `width` prop', () => {
  const vm = shallow({
    render(h) {
      return (
        <LightBox width={300}>
          <LightBox.Open>
            open lightbox
          </LightBox.Open>
          <LightBox.View>
            <div>
              <LightBox.Close />
            </div>
          </LightBox.View>
        </LightBox>
      )
    },
  })

  const _viewPort = $(vm.$el).find(`.${s.view}`)[0]
  expect(getComputedStyle(_viewPort).width).toBe('300px')
})

it('Test LightBox `closeOnClickMask`', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      mounted() {
        $(this.$el).find(`[data-role="lb-open"]`).trigger('click')

        this.$nextTick(done)
      },
      render(h) {
        return (
          <LightBox closeOnClickMask>
            <LightBox.Open>
              open lightbox
            </LightBox.Open>
            <LightBox.View>
              <div>
                <LightBox.Close />
              </div>
            </LightBox.View>
          </LightBox>
        )
      },
    })
  })

  expect(vm.opened).toBe(true)

  const [open, view] = vm.$children
  await new Promise((done) => {
    $(view.$el).trigger('click')
    vm.$nextTick(done)
  })
  expect(vm.opened).toBe(false)
})


it('Test LightBox `closeOnESC`', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      mounted() {
        $(this.$el).find(`[data-role="lb-open"]`).trigger('click')

        this.$nextTick(done)
      },
      render(h) {
        return (
          <LightBox closeOnESC>
            <LightBox.Open>
              open lightbox
            </LightBox.Open>
            <LightBox.View>
              <div>
                <LightBox.Close />
              </div>
            </LightBox.View>
          </LightBox>
        )
      },
    })
  })

  expect(vm.opened).toBe(true)

  const [open, view] = vm.$children

  await new Promise((done) => {
    const k27 = new window.KeyboardEvent('keydown', { keyCode: 27, which: 27 })
    const kNot27 = new window.KeyboardEvent('keydown', { keyCode: 72, which: 72 })

    view.$el.dispatchEvent(kNot27)
    view.$el.dispatchEvent(k27)
    vm.$nextTick(done)
  })
  expect(vm.opened).toBe(false)
})
