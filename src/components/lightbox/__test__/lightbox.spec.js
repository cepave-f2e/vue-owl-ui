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
    }
  })

  const [open, view] = vm.$children

  expect($(open.$el).attr('data-role')).toBe('lb-open')
  expect($(view.$el).attr('data-role')).toBe('lb-view')
})

it('Test LightBox `closeOnClickMask` and `closeOnESC`', async() => {
  let vm
  await new Promise((done) => {
    vm = shallow({
      mounted() {
        const [open, view] = this.$children

        $(this.$el).find(`[data-role="lb-open"]`).trigger('click')

        this.$nextTick(done)
      },
      render(h) {
        return (
          <LightBox closeOnClickMask closeOnESC>
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
      }
    })
  })
})

it('Test LightBox open', () => {
  const vm = shallow({
    render(h) {
      return (
        <LightBox>
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
    }
  })
  const [open, view] = vm.$children

  $(open.$el).trigger('click')
})

it('Test LightBox close', async() => {
  const vm = shallow({
    render(h) {
      return (
        <LightBox>
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
    }
  })
  $(vm.$el).find(`.${s.x}`).trigger('click')
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
    }
  })

  const _viewPort = $(vm.$el).find(`.${s.view}`)[0]
  expect(getComputedStyle(_viewPort).width).toBe('300px')
})
