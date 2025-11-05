import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SMM from './pages/SMM'
import WebDevelop from './pages/Web-Develop'
import Design from './pages/Design'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/smm" element={<SMM />} />
      <Route path="/design" element={<Design />} />
      <Route path="/web-develop" element={<WebDevelop />} />
    </Routes>
  )
}

export default App
