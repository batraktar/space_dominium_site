import { Link } from 'react-router-dom'
import './regions-links.scss'

type RegionsLinksProps = {
  tone?: 'light' | 'dark'
  title?: string
}

const links = [
  { to: '/ua/kyiv', label: 'Київ' },
  { to: '/ua/lviv', label: 'Львів' },
  { to: '/ua/zakarpattia', label: 'Закарпаття' },
  { to: '/ua/ukraine', label: 'Вся Україна' },
]

export default function RegionsLinks({ tone = 'dark', title = 'Регіони роботи' }: RegionsLinksProps) {
  return (
    <section className={`regions-links regions-links--${tone}`} aria-label="Регіони роботи">
      <div className="regions-links__inner">
        <h2>{title}</h2>
        <div className="regions-links__items">
          {links.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
