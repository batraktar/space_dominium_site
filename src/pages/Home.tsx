import Header from '../components/Header'

import Slider from '../components/Slider'
import Talk from '../components/Talk'
import Animation from '../components/animation/Animation'
import Question from '../components/Question'
import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="wrapper">
      <Header />
      <main className="page">
        <div className="page__container">
          <Slider />
          <Talk
            text={<>Досить гуглити інші агенції. Поговоріть з нами. Напишіть прямо зараз!</>}
            ctaLabel="Звʼязатись ♡"
          />
          <Animation />
          <Question
            sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=0&single=true&output=csv"
            plusColor="#A88AED"
            titleColor="#A88AED"
          />
          <ContactUs />
        </div>
      </main>
      <Footer
        title={<>Почнемо щось круте?</>}
        titleColor="#000"
        buttonLabel="почати співпрацю"
        btnTextColor="#A88AED"
        underlineColor="#000"
        arrowCircleColor="#000"
        arrowColor="#A88AED"
      />
    </div>
  )
}

export default Home
