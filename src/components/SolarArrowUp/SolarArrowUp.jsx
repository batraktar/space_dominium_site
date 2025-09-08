/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";

export const SolarArrowUp = ({
  className,
  solarArrowUp = "https://c.animaapp.com/meaj648nc30xDr/img/solar-arrow-up-outline.svg",
}) => {
  return (
    <img
      className={`solar-arrow-up ${className}`}
      alt="Solar arrow up"
      src={solarArrowUp}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ cursor: "pointer" }}
    />
  );
};
