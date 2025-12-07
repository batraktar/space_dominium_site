import React from "react";
import styles from "./quote.module.scss";
import DotsBg from "./ui/ContactButton/DotsBG";

const Quote: React.FC = () => {
  return (
    <section className={styles.quote}>
      {/* Top Separator to cut into the previous white section */}
      <div className={styles.quote__separator_top}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0 100 L1440 0 V100 H0 Z" fill="#A88AED" />
        </svg>
      </div>

      <DotsBg 
        bgColor="#A88AED" 
        dotColor="rgba(255,255,255,0.3)" 
        className={styles.quote__dots_wrapper}
      >
        <div className={styles.quote__container}>
          <div className={styles.quote__content}>
            <p className={styles.quote__text}>
              Design Direction, Art Direction, Creative Direction, Brand Strategy, Brand Voice, UX/UI Design, Communication & Tech Ideas... 
              Through Masterful and Performing we can help. We focus on building unique Brand Experiences. 
              Strong Branding Concepts and Visual Identities That Explore Innovation. Each Work That We Create Everything From Logo And Identity Design To Full Website And Mobile App Interfaces, Marketing Campaigns, Product Presentations And Custom Illustrations. 
              We Approach Every Project With Deep Research, Strategic Thinking And A Commitment To Detail. Because We Believe Design Is More Than Aesthetics. It Is A Tool That Connects Brands With People Builds Recognition And Drives Growth By Combining Creativity Functionality.
            </p>
            
            <div className={styles.quote__author}>
              <span className={styles.quote__name}>ANTON POPOV</span>
              <span className={styles.quote__role}>SENIOR GRAPHIC DESIGNER</span>
            </div>
          </div>
        </div>
      </DotsBg>
    </section>
  );
};

export default Quote;
