import './header.scss'
import SpaceLogo from '../assets/SPACE.png'

function Header() {
  return (
    <header className="header">
      <div className="header__container header__container--header">
        <button className="header__btn">Lets talk</button>
        <div className="header__body">
          <img src={SpaceLogo} className="header__logo"></img>
          <div className="header__logo-bottom">
            <span>Dominium</span>
            <span>Agency</span>
          </div>
          <nav className="header__nav nav">
            <ul className="nav__list">
              <li className="nav__item">
                <a href="#Home">Home</a>
              </li>
              <li className="nav__item">
                <a href="#Studio">Studio</a>
              </li>
              <li className="nav__item">
                <a href="#Work">Work</a>
              </li>{' '}
              <li className="nav__item">
                <a href="#Services">Services</a>
              </li>
              <li className="nav__item">
                <a href="#News">News</a>
              </li>
              <li className="nav__item">
                <a href="#Contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
