import React from "react";
import styles from "./services.module.scss";

const Services: React.FC = () => {
  return (
    <section className={styles.services}>
      {/* Top Diagonal Separator */}
      <div className={styles.services__separator_top}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 100 L1440 0 V100 H0 Z" fill="#FFFEEC" />
        </svg>
      </div>

      <div className={styles.services__container}>
        <h2 className={styles.services__title}>Our Services &<br/>Expertise</h2>
        
        <div className={styles.services__content}>
          <div className={styles.services__card}>
            <h3>Brand and Marketing Roadmaps</h3>
            <p>Previous or underdeveloped brand? Let's fix it for future.</p>
            <ul>
              <li>Brand Audit & Strategy</li>
              <li>Marketing & Content Strategy</li>
              <li>Communications & Campaign Strategy</li>
              <li>Managing & Tone Strategy</li>
              <li>Trend Analysis</li>
              <li>CJM Analysis & Setup</li>
              <li>SEO / Search Strategy</li>
            </ul>
          </div>

          <div className={`${styles.services__card} ${styles.services__card_right}`}>
            <h3>Brand Development</h3>
            <p>Align and evolve your brand to be noticed, felt, and remembered.</p>
            <ul>
              <li>Logo & Identity Design</li>
              <li>Brand Guidelines & Systems</li>
              <li>Naming & Verbal Identity</li>
              <li>Packaging & Print Design</li>
              <li>Art Direction</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Diagonal Separator (Part of the next section really, but we can handle it here or in the next component) 
          Actually, let's make the white section just end straight and let the next section (Quote) have the diagonal top.
          Wait, looking at the screenshot, the white section cuts INTO the purple Quote section.
          So the Quote section should have a diagonal top that matches.
      */}
    </section>
  );
};

export default Services;
