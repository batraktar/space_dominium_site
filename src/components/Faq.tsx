import type { FC } from "react";
import "./faq.scss"
import Question from "./Question";

const FAQ: FC = () => {
  return (
    <div className="faq_page">
      <div className="faq__container">
        <div className="faq_wrapper">
          <div className="faq_title">
            <h1>FAQ</h1>
          </div>
          <Question />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
