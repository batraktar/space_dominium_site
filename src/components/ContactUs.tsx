import React from "react";
import "./ContactUs.scss";

type ContactUsProps = {
  formBg?: string;
  inputBorder?: string;
  buttonBg?: string;
};

const ContactUs: React.FC<ContactUsProps> = ({
  formBg,
  inputBorder,
  buttonBg,
}) => {
  const cssVars: React.CSSProperties = {
    ...(formBg ? { ["--contact-form-bg" as any]: formBg } : null),
    ...(inputBorder ? { ["--contact-input-border" as any]: inputBorder } : null),
    ...(buttonBg ? { ["--contact-button-bg" as any]: buttonBg } : null),
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="contact-section">
      <div className="contact__container">
        <div className="contact-wrapper" style={cssVars}>
          <div className="contact_block-first">
            <h1>Є проєкт? Пишіть!</h1>
            <p>
              Не любимо порожні обіцянки. Любимо конкретику. Є ідея чи проєкт?
              Розкажіть нам — дамо чесну оцінку, запропонуємо рішення та почнемо
              працювати над вашим успіхом.
            </p>
          </div>

          <div className="contact_block-second">
            <form className="contact_form" onSubmit={handleSubmit}>
              <h2>Почнемо співпрацю</h2>

              <div className="form_content_wrapper">
                <div className="form_content">
                  <input name="firstName" type="text" placeholder="Імʼя" />
                  <input name="lastName" type="text" placeholder="Назва Компанії" />
                </div>

                <div className="form_content">
                  <input name="email" type="email" placeholder="Email" />
                  <input name="phone" type="tel" placeholder="Номер телефону" />
                </div>
              </div>

              <div className="des_button">
                <textarea
                  name="message"
                  placeholder="Розкажіть про Ваш проєкт, або опишіть ідею"
                  rows={4}
                />
                <button type="submit">Надіслати</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
