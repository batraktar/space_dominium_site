import './header.scss'
import SpaceLogo from '../assets/SPACE.png'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container header__container--header">
        <div className="header__btn-spacer  "></div>
        <button className="header__btn">Lets talk</button>
        <div className="header__body">
          <img src={SpaceLogo} className="header__logo" alt="Logo" />
          <div className="header__logo-bottom">
            <span>Dominium</span>
            <span>Agency</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
