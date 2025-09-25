import { useEffect } from 'react'

function HeaderDomMove() {
  useEffect(() => {
    const moveButton = () => {
      const btn = document.querySelector('.header__btn, .nav__btn') // на всякий випадок
      const nav = document.querySelector('.nav')
      const header = document.querySelector('.header__container')

      if (!btn || !nav || !header) return

      if (window.innerWidth <= 991.98) {
        // Переміщаємо кнопку в nav
        if (btn.parentNode !== nav) {
          nav.appendChild(btn)
        }
        btn.classList.remove('header__btn')
        btn.classList.add('nav__btn')
      } else {
        // Повертаємо кнопку в header
        if (btn.parentNode !== header) {
          header.appendChild(btn)
        }
        btn.classList.remove('nav__btn')
        btn.classList.add('header__btn')
      }
    }

    // Виконуємо одразу
    moveButton()

    // При ресайзі
    window.addEventListener('resize', moveButton)

    return () => window.removeEventListener('resize', moveButton)
  }, [])

  return null // компонент нічого не рендерить
}

export default HeaderDomMove
