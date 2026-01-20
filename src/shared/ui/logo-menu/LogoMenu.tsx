import './logo-menu.scss'
import { NavLink } from 'react-router-dom'
import React from 'react'
import logo from '../../../assets/img/logo/logo-nav-menu.svg'

type LogoMenuProps = {
  behavior?: 'floating' | 'static'
}

const items = [
  { id: '/', label: 'Головна' },
  { id: '/smm', label: 'SMM' },
  { id: '/design', label: 'Дизайн' },
  { id: '/web-develop', label: 'Веб-розробка' },
  { id: '/contacts', label: 'Контакти' },
]

function LogoMenu({ behavior = 'static' }: LogoMenuProps) {
  const [isAtTop, setIsAtTop] = React.useState(true)

  React.useEffect(() => {
    if (behavior !== 'floating') return

    const onScroll = () => {
      setIsAtTop(window.scrollY <= 10)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [behavior])

  const rootClassName =
    behavior === 'floating'
      ? `logo-menu logo-menu--floating ${isAtTop ? 'logo-menu--bottom' : 'logo-menu--top'}`
      : 'logo-menu'

  return (
    <div className={rootClassName}>
      <NavLink to="/" className="logo-menu__logo">
        <img src={logo} alt="Space logo" />
      </NavLink>

      <nav className="nav">
        <ul className="nav__list">
          {items.map((it) => (
            <li key={it.id} className="nav__item">
              <NavLink
                to={it.id}
                end={it.id === '/'}
                className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
              >
                {it.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default LogoMenu
