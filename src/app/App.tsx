import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('../pages/home/Home'))
const Smm = lazy(() => import('../pages/smm/Smm'))
const Design = lazy(() => import('../pages/design/Design'))
const WebDevelopment = lazy(() => import('../pages/web-development/WebDevelopment'))

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smm" element={<Smm />} />
        <Route path="/design" element={<Design />} />
        <Route path="/web-develop" element={<WebDevelopment />} />
      </Routes>
    </Suspense>
  )
}

export default App
