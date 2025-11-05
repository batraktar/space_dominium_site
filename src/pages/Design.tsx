import React from 'react';
import DesignHero from '../components/DesignHero/DesignHero';
import DesignServices from '../components/DesignServices/DesignServices';
import './Design.scss';
import Menu from '/Users/mac/Desktop/space_dominium_site/src/components/Menu.tsx'

const Design: React.FC = () => (
  <main className="design-page">
    <div className="design-page__container">
      <DesignHero />
      <Menu />
      <DesignServices />
    </div>
  </main>
);

export default Design;
