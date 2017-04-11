import Message from '../'

describe('Message', () => {
  let vm

  beforeEach(() => {
    vm = Message({
      message: 'test',
      duration: 500,
      showClose: true,
      onClose() {},
      iconClass: 'test',
    })
  })

  afterEach(() => {
    const el = document.querySelector('[data-role=message]')
    if (el) {
      el.remove()
    }
    if (vm) {
      vm.$destroy()
    }
  })

  it('a string as a parameter', () => {
    vm = Message('test')
    expect(vm.$el.textContent).toBe('test')
  })

  it('if message is closed automatically', async () => {
    expect(document.querySelector('[data-role=message]')).not.toBeNull()
    await new Promise((done) => {
      setTimeout(() => {
        done()
      }, 1000)
    })
    expect(document.querySelector('[data-role=message]')).toBeNull()
  })

  it('closed message manually', async () => {
    expect(document.querySelector('[data-role=message]')).not.toBeNull()
    vm.$el.querySelector('[data-role=closeBtn]').click()
    await new Promise((done) => {
      setTimeout(() => {
        done()
      }, 300)
    })
    expect(document.querySelector('[data-role=message]')).toBeNull()
  })

  it('if callback function is triggered after message is closed', async () => {
    const mockFn = jest.fn()
    vm.onClose = mockFn
    await new Promise((done) => {
      setTimeout(() => {
        done()
      }, 3500)
    })
    expect(vm.onClose).toHaveBeenCalled()
  })

  it('if clearTimeout is triggered after message is mouseentered', () => {
    expect(vm.timer).not.toBeNull()
    const event = new MouseEvent('mouseenter')
    document.querySelector('[data-role=message]').dispatchEvent(event)
    expect(vm.timer).toBeNull()
    vm.$destroy()
  })

  it('use custom icon if set iconClass to true', () => {
    expect(vm.$el.querySelector('.test')).not.toBeNull()
  })
})