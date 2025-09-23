import './main-section.scss'
import Slider from './Slider'
import Talk from './Talk'
import Menu from './Menu'
import ContactUs from './ContactUs'

function Main() {
  return (
    <main className="page">
      <div className="page__container">
        <Menu />
        <Slider />
        <Talk />
        <ContactUs />
      </div>
    </main>
  )
}

export default Main
