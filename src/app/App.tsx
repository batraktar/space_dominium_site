import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScrollToTop from '../shared/ui/scroll-to-top/ScrollToTop'

const Home = lazy(() => import('../pages/home/Home'))
const Smm = lazy(() => import('../pages/smm/Smm'))
const Design = lazy(() => import('../pages/design/Design'))
const WebDevelopment = lazy(() => import('../pages/web-development/WebDevelopment'))
const About = lazy(() => import('../pages/contacts/About'))

function App() {
  return (
    <Suspense fallback={<div className="app-fallback">Трішки зачекай, сайт завантажується…</div>}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smm" element={<Smm />} />
        <Route path="/design" element={<Design />} />
        <Route path="/web-develop" element={<WebDevelopment />} />
        <Route path="/contacts" element={<About />} />
      </Routes>
    </Suspense>
  )
}

export default App
