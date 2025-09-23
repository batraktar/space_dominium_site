import React from "react";
import "./Footer.scss";
import ModelViewer from "../Animation/ModelViewer";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer__container">
        <div className="footer_wrapper">
          <div className="footer_left">
            <div className="footer_title">
              <h1>Ready to<br/>push beyond limits?</h1>
            </div>

            <div className="footer_button">
              <button type="button" aria-label="Contact us">Contact us</button>
              <img src="src/assets/ei_arrow-up.svg" alt="Arrow up" />
            </div>

            <div className="footer_menu">
              <div className="footer_menu_content">
                <h2>Services</h2>
                <p>AI and Data Annotation</p>
                <p>Digital Production</p>
                <p>Custom IT solution</p>
              </div>

              <div className="footer_menu_content">
                <h2>Sectors</h2>
                <p>Fintech</p>
                <p>E-grocery</p>
                <p>Manufacturing</p>
                <p>Logistics</p>
                <p>eCommerce</p>
              </div>

              <div className="footer_menu_content">
                <h2>Company</h2>
                <p>About us</p>
                <p>Our missions</p>
                <p>Team</p>
                <p>Achievements</p>
                <p>Careers</p>
              </div>
            </div>
          </div>

          <div className="footer_right">
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="Antoshka">
          <p>Website made by Antoshka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
