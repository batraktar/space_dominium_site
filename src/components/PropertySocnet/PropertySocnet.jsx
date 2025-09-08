/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Frame481 } from "..";
import "./style.css";

export const PropertySocnet = ({
  className,
  frame481Vector = "https://c.animaapp.com/meaj648nc30xDr/img/vector-7-1.svg",
  frame481Img = "https://c.animaapp.com/meaj648nc30xDr/img/vector-9.svg",
  frame481Vector1 = "https://c.animaapp.com/meaj648nc30xDr/img/vector-2.svg",
  frame481Vector2 = "https://c.animaapp.com/meaj648nc30xDr/img/vector-5.svg",
  frame481Vector3 = "https://c.animaapp.com/meaj648nc30xDr/img/vector-8.svg",
  frame481Vector4 = "https://c.animaapp.com/meaj648nc30xDr/img/vector-10.svg",
  frame481Line = "https://c.animaapp.com/meaj648nc30xDr/img/line-7.svg",
}) => {
  return (
    <div className={`property-socnet ${className}`}>
      <Frame481
        className="frame-instance"
        cuidaMonitor="https://c.animaapp.com/meaj648nc30xDr/img/cuida-monitor-outline-2.svg"
        famiconsShare="https://c.animaapp.com/meaj648nc30xDr/img/famicons-share-social-outline-2.svg"
        frame="https://c.animaapp.com/meaj648nc30xDr/img/frame-25-2.svg"
        frame1="https://c.animaapp.com/meaj648nc30xDr/img/frame-36-2.svg"
        frame2="https://c.animaapp.com/meaj648nc30xDr/img/frame-33-2.svg"
        frame3="https://c.animaapp.com/meaj648nc30xDr/img/frame-34-2.svg"
        img="https://c.animaapp.com/meaj648nc30xDr/img/frame-32-2.svg"
        line={frame481Line}
        materialSymbols="https://c.animaapp.com/meaj648nc30xDr/img/material-symbols-light-dashboard-outline-rounded-2.svg"
        proiconsPhone="https://c.animaapp.com/meaj648nc30xDr/img/proicons-phone-2.svg"
        property1="default"
        vector={frame481Vector2}
        vector1={frame481Vector3}
        vector2={frame481Vector}
        vector3={frame481Img}
        vector4={frame481Vector4}
        vector5={frame481Vector1}
      />
    </div>
  );
};
