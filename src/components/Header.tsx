import { useState } from 'react'
import './header.scss'
import SpaceLogo from '../assets/SPACE.png'

interface MenuItem {
  id: string
  label: string
}

const menuItems: MenuItem[] = [
  { id: 'Home', label: 'Home' },
  { id: 'Studio', label: 'Studio' },
  { id: 'Work', label: 'Work' },
  { id: 'Services', label: 'Services' },
  { id: 'News', label: 'News' },
  { id: 'Contact', label: 'Contact' },
]

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Home')

  return (
    <header className="header">
      <div className="header__container header__container--header">
        <button className="header__btn">Lets talk</button>
        <div className="header__body">
          <img src={SpaceLogo} className="header__logo" alt="Logo" />
          <div className="header__logo-bottom">
            <span>Dominium</span>
            <span>Agency</span>
          </div>
          <nav className="header__nav nav">
            <ul className="nav__list">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className={`nav__item ${
                    activeItem === item.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveItem(item.id)}
                >
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
