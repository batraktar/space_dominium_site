import React from "react";
import "./contactUs.scss";

const ContactUs: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="contact-section">
      <div className="contact__container">
        <div className="contact-wrapper">
          <div className="contact_block-first">
            <h1>Contact Us</h1>
            <p>
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet. Lorem ipsum
              dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet Lorem ipsum dolor sit amet
            </p>
          </div>

          <div className="contact_block-second">
            <form className="contact_form" onSubmit={handleSubmit}>
              <h2>Tell us about your project</h2>

              <div className="form_content_wrapper">
                <div className="form_content">
                  <input name="firstName" type="text" placeholder="First name" />
                  <input name="lastName" type="text" placeholder="Last name" />
                </div>

                <div className="form_content">
                  <input name="email" type="email" placeholder="Email" />
                  <input name="phone" type="tel" placeholder="Phone" />
                </div>
              </div>

              <div className="des_button">
                <textarea
                  name="message"
                  placeholder="Tell us about your idea"
                  rows={4}
                />
                <button type="submit">Send message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
