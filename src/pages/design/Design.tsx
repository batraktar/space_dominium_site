import ServiceLayout from '../../shared/layout/ServiceLayout'

import Cards from './components/Cards'
import Hero from './components/Hero'
import HeroSection from './components/HeroSection'
import Services from './components/Services'

function Design() {
  return (
    <ServiceLayout
      className="wrapper"
      hero={
        <>
          <Hero />
          <HeroSection />
        </>
      }
      affix={{
        fixedPosition: 'bottom',
        alwaysFixed: true,
      }}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1925531033&single=true&output=csv',
        plusColor: '#B5CAFF',
        titleColor: '#B5CAFF',
      }}
      contact={{
        formBg: 'rgba(0, 0, 0, 0.10)',
        inputBorder: '#CBD83B',
        buttonBg: '#CBD83B',
      }}
      footer={{
        titleColor: '#000',
        buttonLabel: 'почати співпрацю',
        btnTextColor: '#CBD83B',
        underlineColor: '#000',
        arrowColor: '#CBD83B',
        arrowCircleColor: '#000',
      }}
    >
      <Services />
      <Cards />
    </ServiceLayout>
  )
}

export default Design
