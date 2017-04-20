import s from './header.scss'
import Logo from '../logo'
import Link from '../../components/link'

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
                <Link to="/">
                  <Logo fill="#fff" size={25} /> OWL UI
                </Link>
                <span class={[s.ver]}>
                  v{__pkgVer}
                </span>
              </h1>
            </div>

            <ul class={[s.link]}>
              <li>
                <Link to="/">
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/components">
                  Components
                </Link>
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
  },
}

module.exports = Header
