import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import SeoHead from '../shared/seo/SeoHead'
import ScrollToTop from '../shared/ui/scroll-to-top/ScrollToTop'

const Home = lazy(() => import('../pages/home/Home'))
const Smm = lazy(() => import('../pages/smm/Smm'))
const Design = lazy(() => import('../pages/design/Design'))
const WebDevelopment = lazy(() => import('../pages/web-development/WebDevelopment'))
const About = lazy(() => import('../pages/contacts/About'))
const Thanks = lazy(() => import('../pages/thanks/Thanks'))
const NotFound = lazy(() => import('../pages/not-found/NotFound'))

function App() {
  return (
    <Suspense fallback={<div className="app-fallback">Трішки зачекай, сайт завантажується…</div>}>
      <ScrollToTop />
      <SeoHead />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smm" element={<Smm />} />
        <Route path="/design" element={<Design />} />
        <Route path="/web-develop" element={<WebDevelopment />} />
        <Route path="/contacts" element={<About />} />
        <Route path="/thanks" element={<Thanks />} />
        {/* Тимчасово вимкнено регіональні SEO-роути.
        <Route path="/ua" element={<RegionalLanding region="ua" />} />
        <Route path="/ua/kyiv" element={<RegionalLanding region="kyiv" />} />
        <Route path="/ua/lviv" element={<RegionalLanding region="lviv" />} />
        <Route path="/ua/zakarpattia" element={<RegionalLanding region="zakarpattia" />} />
        <Route path="/ua/ukraine" element={<RegionalLanding region="ukraine" />} />
        */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
