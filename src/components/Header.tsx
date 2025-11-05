import React, { useEffect, useState } from "react";
import "./header.scss";
import videoMp4 from "../assets/video/laptop_people_1920x780.mp4";
import videoWebm from "../assets/video/output_1920x780.webm";
import ContactButton from "./ui/ContactButton/ContactButton";
import LogoMenu from "./LogoMenu";
import { useAffix } from "../hooks/useAffix";

const Header: React.FC = () => {
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null);

  const { affixed, barHeight } = useAffix({
    triggerEl: headerEl,
    barEl,
    top: 0,
    bottomGap: 20,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--bar-h", `${barHeight || 0}px`);
  }, [barHeight]);

  return (
    <>
      <header className="header" ref={setHeaderEl}>
        <video
          className="header__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoMp4} type="video/mp4" />
        </video>

        <div
          ref={setBarEl}
          className={`header__bar ${affixed ? "header__bar--fixed" : ""}`}
        >
          <div className="header__center">
            <LogoMenu />
          </div>

          <div className="header__right">
            <ContactButton
              show={true}
              text="Зв’язатись ♡"
              href="#contact"
              bgColor="#A88AED"
              textColor="#000000"
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
