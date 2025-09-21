import './main-section.scss'
import Slider from './Slider'
import Talk from './Talk'
import Menu from './Menu'

function Main() {
  return (
    <main className="page">
      <div className="page__container">
        <Menu />
        <Slider />
        <Talk />
      </div>
    </main>
  )
}

export default Main
