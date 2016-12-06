import Markdown from '../../components/markdown'
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
                <dt>General</dt>
                <dd>
                  <router-link to="/components/icons">Icon</router-link>
                </dd>
                <dd>
                  <router-link to="/components/loading">Loading</router-link>
                </dd>
                <dd>
                  <router-link to="/components/tip">Tip</router-link>
                </dd>
                <dd>
                  <router-link to="/components/lightbox">LightBox</router-link>
                </dd>
                <dd>
                  <router-link to="/components/label">Label</router-link>
                </dd>
                <dd>
                  <router-link to="/components/dual-list">DualListBox</router-link>
                </dd>
                <dd>
                  <router-link to="/components/tab">Tab</router-link>
                </dd>
              </dl>

              <dl>
                <dt> Form </dt>
                <dd>
                  <router-link to="/components/select">Select</router-link>
                </dd>
                <dd>
                  <router-link to="/components/checkbox">Checkbox</router-link>
                </dd>
                <dd>
                  <router-link to="/components/switch">Switch</router-link>
                </dd>
                <dd>
                  <router-link to="/components/radio">Radio</router-link>
                </dd>
                <dd>
                  <router-link to="/components/button">Button</router-link>
                </dd>
                <dd>
                  <router-link to="/components/input">Input</router-link>
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
