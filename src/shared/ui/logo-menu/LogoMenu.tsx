import './logo-menu.scss'
import { NavLink } from 'react-router-dom'
import React from 'react'
import logo from '../../../assets/img/logo/logo-nav-menu.svg'
import burgerIcon from './icons/burger.svg'

type LogoMenuProps = {
  behavior?: 'floating' | 'static'
}

const items = [
  { id: '/', label: 'Головна' },
  { id: '/smm', label: 'SMM' },
  { id: '/design', label: 'Дизайн' },
  { id: '/web-develop', label: 'Веб-розробка' },
  { id: '/contacts', label: 'Про нас' },
]

function LogoMenu({ behavior = 'static' }: LogoMenuProps) {
  const [isAtTop, setIsAtTop] = React.useState(true)
  const [isOpen, setIsOpen] = React.useState(false)

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

      <button
        type="button"
        className="logo-menu__toggle"
        aria-label="Відкрити меню"
        aria-expanded={isOpen}
        aria-controls="logo-menu-nav"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src={burgerIcon} alt="" />
      </button>

      <nav className={`nav${isOpen ? ' nav--open' : ''}`} id="logo-menu-nav">
        <ul className="nav__list">
          {items.map((it) => (
            <li key={it.id} className="nav__item">
              <NavLink
                to={it.id}
                end={it.id === '/'}
                className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
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
