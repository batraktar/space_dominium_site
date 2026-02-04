import Header from './components/Header'
import Slider from './components/Slider'
import Animation from './components/animation/Animation'
import HeroCta from '../../shared/sections/hero-cta/HeroCta'
import Contact from '../../shared/sections/contact/Contact'
import Faq from '../../shared/sections/faq/Faq'
import Footer from '../../shared/sections/footer/Footer'
import './home.scss'

function Home() {
  return (
    <div className="wrapper">
      <Header />
      <main className="page">
        <div className="page__container home__container">
          <Slider />
          <HeroCta
            text={<>Досить гуглити інші агенції. Поговоріть з нами. Напишіть прямо зараз!</>}
            ctaLabel="Звʼязатись ♡"
          />
          <Animation />
          <Faq
            sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=0&single=true&output=csv"
            plusColor="#A88AED"
            titleColor="#A88AED"
          />
          <Contact />
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
