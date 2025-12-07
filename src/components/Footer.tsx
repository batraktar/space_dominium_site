import React from "react";
import "./Footer.scss";
import ModelViewer from "../Animation/ModelViewer";

type FooterProps = {
  title?: React.ReactNode;
  buttonLabel?: string;
  titleColor?: string;
  btnTextColor?: string;
  underlineColor?: string;
  arrowColor?: string;
  arrowCircleColor?: string;
};

const Footer: React.FC<FooterProps> = ({
  title = <>Створимо візуал<br/>який запамʼятовується</>,
  buttonLabel = "почати співпрацю",
  titleColor,
  btnTextColor,
  underlineColor,
  arrowColor,
  arrowCircleColor,
}) => {
  const cssVars: React.CSSProperties = {
    ...(titleColor && { ["--footer-title-color" as any]: titleColor }),
    ...(btnTextColor && { ["--footer-button-text-color" as any]: btnTextColor }),
    ...(underlineColor && { ["--footer-underline-color" as any]: underlineColor }),
    ...(arrowColor && { ["--footer-arrow-color" as any]: arrowColor }),
    ...(arrowCircleColor && { ["--footer-arrow-circle-color" as any]: arrowCircleColor }),
  };

  return (
    <footer>
      <div className="footer__container">
        <div className="footer_wrapper" style={cssVars}>
          <div className="footer_left">
            <div className="footer_title">
              <h1>{title}</h1>
            </div>

            <div className="footer_button">
              <button type="button" aria-label="Contact us">
                {buttonLabel}
              </button>

              <svg
                className="footer_arrow"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20.5"
                  stroke="var(--footer-arrow-circle-color, currentColor)"
                  strokeWidth="3"
                />
                <path
                  d="M20 14L28 22L20 30"
                  stroke="var(--footer-arrow-color, currentColor)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="footer_menu">
              <div className="footer_menu_content">
                <h2>Послуги</h2>
                <p>IT-рішення / Веб-розробка</p>
                <p>Графічний Дизайн</p>
                <p>SMM</p>
              </div>

              <div className="footer_menu_content">
                <h2>Компанія</h2>
                <p>Про нас</p>
                <p>Наша місія</p>
                <p>Команда</p>
                <p>Досягнення</p>
                <p>Вакансії</p>
              </div>

              <div className="footer_menu_content">
                <h2>Контакти</h2>
                <p>
                  <a href="mailto:hello@space.dominium">
                    Email: hello@space.dominium.com.ua
                  </a>
                </p>
                <p>
                  <a href="tel:+380XXXXXXXXX">
                    Телефон: +380XXXXXXXXX
                  </a>
                </p>
                <p>
                  <a
                    href="https://maps.google.com/?q=м.+Хуст,+Україна"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Адреса: м. Хуст, Україна
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="footer_right">
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width={400}
              height={400}
              showScreenshotButton={false}
            />
          </div>
        </div>

        <div className="Antoshka">
          <p>Website made by Pylypiuk</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
