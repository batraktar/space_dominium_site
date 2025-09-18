import './main-section.scss'
import Slider from './Slider'
import Talk from './Talk'

function Main() {
  return (
    <main className="page">
      <div className="page__container">
        <Slider />
        <Talk />
      </div>
    </main>
  )
}

export default Main
