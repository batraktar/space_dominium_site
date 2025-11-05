import "./logo-menu.scss";
import { NavLink } from "react-router-dom";
import logo from "../assets/img/logo/logo-nav-menu.svg";

const items = [
  { id: "/", label: "Головна" },
  { id: "/smm", label: "SMM" },
  { id: "/design", label: "Дизайн" },
  { id: "/web-develop", label: "Веб-розробка" },
  { id: "/contacts", label: "Контакти" },
];

function LogoMenu() {
  return (
    <div className="logo-menu">
      <NavLink to="/" className="logo-menu__logo">
        <img src={logo} alt="Space logo" />
      </NavLink>

      <nav className="nav">
        <ul className="nav__list">
          {items.map((it) => (
            <li key={it.id} className="nav__item">
              <NavLink
                to={it.id}
                end={it.id === "/"}
                className={({ isActive }) =>
                  `nav__link${isActive ? " nav__link--active" : ""}`
                }
              >
                {it.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default LogoMenu;
