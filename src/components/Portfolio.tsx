import React from 'react'
import styles from './portfolio.module.scss'

// Placeholder images
import imgVoto from '../assets/img/cards-main/WD.png' // Placeholder
import imgDebt from '../assets/img/cards-main/BD_pearl.png' // Placeholder
import imgPhotonic from '../assets/img/cards-main/CS.png' // Placeholder
import imgMech from '../assets/img/cards-main/BD_purple.png' // Placeholder

const cases = [
  { id: 1, title: 'VOTO', img: imgVoto, desc: 'Branding / Merch' },
  { id: 2, title: 'D.E.B.T.', img: imgDebt, desc: 'Typography / Identity' },
  { id: 3, title: 'Photonic', img: imgPhotonic, desc: 'Mobile App UI' },
  { id: 4, title: 'Mech Master', img: imgMech, desc: 'Game / Web UI' },
]

const Portfolio: React.FC = () => {
  return (
    <section className={styles.portfolio}>
      <div className={styles.portfolio__container}>
        <div className={styles.portfolio__gallery}>
          {cases.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.card__image_wrapper}>
                <img
                  src={item.img}
                  alt={item.title}
                  className={styles.card__image}
                  decoding="async"
                />
              </div>
              <div className={styles.card__overlay}>
                <h3 className={styles.card__title}>{item.title}</h3>
                <p className={styles.card__desc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.portfolio__footer}>
          <button className={styles.portfolio__btn}>Дивитися всі роботи</button>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
