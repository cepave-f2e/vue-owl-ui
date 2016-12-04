import s from './header.scss'
import Logo from '../logo'

const Header = {
  name: 'Header',
  render(h) {
    const { $slots } = this
    return (
      <header>
        <div class="w1120">
          <div class="fbox -around">
            <div>
              <h1>
                <router-link to="/">
                  <Logo fill="#fff" size={25} /> OWL UI
                </router-link>
                <span class={[s.ver]}>
                  v{__pkgVer}
                </span>
              </h1>
            </div>

            <ul>
              <li>
                <router-link to="/">
                  Docs
                </router-link>
              </li>
              <li>
                <router-link to="/components">
                  Components
                </router-link>
              </li>
              <li>
                <a href="//github.com/cepave-f2e/vue-owl-ui" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <a href="//github.com/cepave-f2e" target="_blank">
                  Cepave F2E
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    )
  }
}

module.exports = Header
