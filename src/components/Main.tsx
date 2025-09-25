import './main-section.scss'
import Slider from './Slider'
import Talk from './Talk'
import Menu from './Menu'
import Animation from './animation/Animation.jsx'
import ContactUs from './ContactUs'
import FAQ from './Faq'

function Main() {
  return (
    <main className="page">
      <div className="page__container">
        <Menu />
        <Slider />
        <Talk />
        <Animation />
        <FAQ />
        <ContactUs />
      </div>
    </main>
  )
}

export default Main
