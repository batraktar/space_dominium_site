import React, { useState } from "react";
import type { FC } from "react";

import "./question.scss";

const Question: FC = () => {
const [open, setOpen] = useState<number | null>(0);
  const toggle = (idx: number) => {
    setOpen(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="question">
      <div className="ques_wrapper">
        <div className="content">
          <div className={`faq_item ${open === 0 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(0)}
              aria-expanded={open === 0}
              aria-controls="ans-0"
            >
              What IT services do you offer?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-0" className="faq_answer">
              <p>We provide web development, SMM, SEO, branding, and IT consulting.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 1 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(1)}
              aria-expanded={open === 1}
              aria-controls="ans-1"
            >
              Do you use templates or custom design?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-1" className="faq_answer">
              <p>We create custom designs tailored to your business needs.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 2 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(2)}
              aria-expanded={open === 2}
              aria-controls="ans-2"
            >
              Is the website mobile-friendly?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-2" className="faq_answer">
              <p>Yes, all our websites are fully responsive.</p>
            </div>
          </div>
        </div>

        {/* Права колонка */}
        <div className="content">
          <div className={`faq_item ${open === 3 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(3)}
              aria-expanded={open === 3}
              aria-controls="ans-3"
            >
              Which social media do you work with?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-3" className="faq_answer">
              <p>We use analytics tools like Google Analytics, Meta Insights, etc.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 4 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(4)}
              aria-expanded={open === 4}
              aria-controls="ans-4"
            >
              Do you create posts and visuals?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-4" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 5 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(5)}
              aria-expanded={open === 5}
              aria-controls="ans-5"
            >
              How do you track SMM results?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-5" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 6 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(6)}
              aria-expanded={open === 6}
              aria-controls="ans-6"
            >
             How much do your services cost?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-6" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 7 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(7)}
              aria-expanded={open === 7}
              aria-controls="ans-7"
            >
              Do you offer monthly support?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-7" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 8 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(8)}
              aria-expanded={open === 8}
              aria-controls="ans-8"
            >
              DCan you redesign my current website?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-8" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>

          <div className={`faq_item ${open === 9 ? "active" : ""}`}>
            <button
              className="faq_question"
              onClick={() => toggle(9)}
              aria-expanded={open === 9}
              aria-controls="ans-9"
            >
              Do you work with international clients?
              <span className="faq_icon"><img src="src/assets/faq_plus.svg"/></span>
            </button>
            <div id="ans-9" className="faq_answer">
              <p>Pricing depends on the project. Contact us for a free quote.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
