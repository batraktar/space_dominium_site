import React from "react";
import styles from "./web-dev-hero.module.scss";
import decorativeGraphic from "../assets/img/web-dev/decorative-shapes.png";

const WebDevHero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__decorative}>
        <img src={decorativeGraphic} alt="" className={styles.hero__graphic} />
      </div>
      
      <div className={styles.hero__container}>
        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>IT SPACE</h1>
          
          <div className={styles.hero__form}>
            <p className={styles.hero__cta_text}>
              Досить гуглити інші агенції. Поговоріть з нами.
              <br />
              Напишіть прямо зараз!
            </p>
            
            <div className={styles.hero__inputs}>
              <input
                type="text"
                placeholder="Імʼя"
                className={styles.hero__input}
              />
              <input
                type="tel"
                placeholder="Номер телефону"
                className={styles.hero__input}
              />
            </div>
            
            <button className={styles.hero__submit_btn}>
              Звʼязатись ♡
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebDevHero;
