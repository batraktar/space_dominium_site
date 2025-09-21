import { useState } from 'react'
import './menu.scss'
import './header.scss'

function Menu() {
  const [activeItem, setActiveItem] = useState<string>('Home')

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

  return (
    <nav className="nav">
      <ul className="nav__list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`nav__item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Menu
