import Markdown from '../../components/markdown'
import Link from '../../components/link'
import s from './components.scss'

const ComponentPage = {
  name: 'ComponentPage',
  render(h) {
    const { $route } = this
    return (
      <div class={s.main}>
        <div class={['w1120', 'fbox']}>
          <aside class={[s.side]}>
            <div id="sticky-menu">
              <dl>
                <dt>Layout</dt>
                <dd>
                  <Link to="/components/flex">Flex (Grid System)</Link>
                </dd>
              </dl>
              <dl>
                <dt>General</dt>
                <dd>
                  <Link to="/components/icons">Icon</Link>
                </dd>
                <dd>
                  <Link to="/components/loading">Loading</Link>
                </dd>
                <dd>
                  <Link to="/components/tip">Tip</Link>
                </dd>
                <dd>
                  <Link to="/components/lightbox">LightBox</Link>
                </dd>
                <dd>
                  <Link to="/components/label">Label</Link>
                </dd>
                <dd>
                  <Link to="/components/dual-list">DualList</Link>
                </dd>
                <dd>
                  <Link to="/components/tab">Tab</Link>
                </dd>
                <dd>
                  <Link to="/components/page">Page</Link>
                </dd>
                <dd>
                  <Link to="/components/grid">Grid</Link>
                </dd>
              </dl>

              <dl>
                <dt> Form </dt>
                <dd>
                  <Link to="/components/select">Select</Link>
                </dd>
                <dd>
                  <Link to="/components/multi-select">MultiSelect</Link>
                </dd>
                <dd>
                  <Link to="/components/checkbox">Checkbox</Link>
                </dd>
                <dd>
                  <Link to="/components/switch">Switch</Link>
                </dd>
                <dd>
                  <Link to="/components/radio">Radio</Link>
                </dd>
                <dd>
                  <Link to="/components/button">Button</Link>
                </dd>
                <dd>
                  <Link to="/components/input">Input</Link>
                </dd>
                <dd>
                  <Link to="/components/date-picker">DatePicker</Link>
                </dd>
              </dl>
            </div>
          </aside>
          <div class={[s.view]}>
            <router-view />
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ComponentPage
