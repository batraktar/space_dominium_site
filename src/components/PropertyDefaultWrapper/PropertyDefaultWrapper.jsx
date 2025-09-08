/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useState } from "react";
import { HeroModule } from "../HeroModule";
import "./style.css";

export const PropertyDefaultWrapper = ({ property1, className }) => {
  const [activeService, setActiveService] = useState(0);

  const handleServiceChange = (serviceIndex) => {
    setActiveService(serviceIndex);
  };

  return (
    <div className={`property-default-wrapper ${className}`}>
      <HeroModule
        className="hero-module-instance"
        onServiceChange={handleServiceChange}
      />

      <div className={`line-container frame-32 service-${activeService}`}>
        <img
          className="line"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-7.svg"
        />

        <img
          className="img"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-7.svg"
        />

        <img
          className="line-2"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />

        <img
          className="line-3"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />

        <img
          className="line-4"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />
      </div>

      <div className={`line-container frame-33 service-${activeService}`}>
        <img
          className="line"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-7.svg"
        />

        <img
          className="line-5"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-5.svg"
        />

        <img
          className="line-2"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />

        <img
          className="line-3"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />

        <img
          className="line-4"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
        />
      </div>

      <div className={`line-container overlap-group-2 service-${activeService}`}>
        <img
          className="line-6"
          alt="Line"
          src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-6.svg"
        />

        <div className="frame-34">
          <img
            className="line"
            alt="Line"
            src="https://c.animaapp.com/meaj648nc30xDr/img/line-2-5.svg"
          />

          <img
            className="img"
            alt="Line"
            src="https://c.animaapp.com/meaj648nc30xDr/img/line-1-7.svg"
          />

          <img
            className="line-2"
            alt="Line"
            src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
          />

          <img
            className="line-3"
            alt="Line"
            src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
          />

          <img
            className="line-4"
            alt="Line"
            src="https://c.animaapp.com/meaj648nc30xDr/img/line-5-5.svg"
          />
        </div>
      </div>

      <img
        className="photo"
        alt="Photo"
        src="https://c.animaapp.com/meaj648nc30xDr/img/photo-2025-07-29-22-37-43-removebg-preview-1-1.png"
      />
    </div>
  );
};
