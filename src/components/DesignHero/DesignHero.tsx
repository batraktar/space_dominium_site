import React from 'react';
import './DesignHero.scss';

import heroMark from '../../assets/design/hero/hero-mark.svg';
import heroBadge from '../../assets/design/hero/hero-badge.svg';
import heroArrow from '../../assets/design/hero/hero-arrow.svg';


const DesignHero: React.FC = () => (
  <section className="design-hero">
    <div className="design-hero__container">
      <div className="design-hero__content">
        <div className="design-hero__heading">
          <h1 className="design-hero__title">SPACE</h1>
          <div className="design-hero__tagline" aria-label="Dominium Agency">
            <span className="design-hero__tagline-item">Dominium</span>
            <span className="design-hero__tagline-item design-hero__tagline-item--muted">Agency</span>
          </div>
        </div>

        <div className="design-hero__cta">
          <a className="design-hero__cta-link" href="#contact">
            Contact us
          </a>
          <span className="design-hero__cta-icon" aria-hidden="true">
            <img src={heroArrow} alt="" />
          </span>
        </div>
      </div>

      <div className="design-hero__mark" aria-hidden="true">
        <img src={heroMark} alt="" />
      </div>
    </div>
  </section>
);

export default DesignHero;
