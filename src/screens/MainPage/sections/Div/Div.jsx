import React from "react";
import "./style.css";
import ModelViewer from "../../../../components/ModelViewer";

export const Div = () => {
  return (
    <div className="div">
      {/* HERO: 2 колонки */}
      <div className="hero">
        {/* Ліва колонка — весь твій текст/кнопка */}
        <div className="hero__content">
          <div className="ready-to-push-beyond-wrapper">
            <div className="ready-to-push-beyond">
              Ready to
              <br />
              push beyond limits?
            </div>
          </div>

          <div className="frame-26">
            <div className="frame-27">
              <div className="text-wrapper-11">Contact us</div>
            </div>
            <img
              className="ei-arrow-up"
              alt="Ei arrow up"
              src="https://c.animaapp.com/meaj648nc30xDr/img/ei-arrow-up.svg"
            />
          </div>
        </div>

        {/* Права колонка — модель */}
        <div className="hero__visual">
          <ModelViewer
            url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
            width="100%"      // тягнеться по колонці
            height={520}      // висота під макет
            enableManualZoom={false}
            autoRotate
            autoRotateSpeed={0.25}
          />
        </div>
      </div>

      {/* Нижні блоки на всю ширину */}
      <div className="services">
        <div className="frame-28">
          <div className="text-wrapper-12">Services</div>
        </div>

        <div className="frame-29">
          <div className="frame-28">
            <div className="text-wrapper-13">AI and Data Annotation</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Digital Production</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-14">Custom IT solution</div>
          </div>
        </div>
      </div>

      <div className="sectors">
        <div className="frame-28">
          <div className="text-wrapper-12">Sectors</div>
        </div>

        <div className="frame-29">
          <div className="frame-28">
            <div className="text-wrapper-13">Fintech</div>
          </div>

          <div className="frame-30">
            <div className="text-wrapper-13">E-grocery</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Manufacturing</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Logistics</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">eCommerce</div>
          </div>
        </div>
      </div>

      <div className="company">
        <div className="frame-28">
          <div className="text-wrapper-12">Company</div>
        </div>

        <div className="frame-29">
          <div className="frame-28">
            <div className="text-wrapper-13">About us</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Our missions</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Team</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Achievements</div>
          </div>

          <div className="frame-28">
            <div className="text-wrapper-13">Careers</div>
          </div>
        </div>
      </div>

      <div className="frame-31">
        <div className="text-wrapper-15">Website made by Antoshka</div>
      </div>
    </div>
  );
};
