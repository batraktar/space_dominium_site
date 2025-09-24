import './main-section.scss'
import Slider from './Slider'
import Talk from './Talk'
import Menu from './Menu'
import ContactUs from './ContactUs'
import FAQ from './Faq'

function Main() {
  return (
    <main className="page">
      <div className="page__container">
        <Menu />
        <Slider />
        <Talk />
        <FAQ />
        <ContactUs />
      </div>
    </main>
  )
}

export default Main
