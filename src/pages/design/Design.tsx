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
          <Hero ctaArrowColor="var(--pearl)" />
          <HeroSection />
        </>
      }
      affix={{
        contactButtonBg: 'var(--pearl)',
        contactButtonTextColor: 'var(--indigo)',
        burgerColor: 'var(--pearl)',
        fixedPosition: 'bottom',
        alwaysFixed: true,
        contactButtonLiftMobilePx: 20,
      }}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1925531033&single=true&output=csv',
        plusColor: 'var(--indigo)',
        titleColor: 'var(--indigo)',
        textColor: '#000',
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
        housePartColors: {
          Floor: '#A88AED',
          Walls: '#d1da76',
          FrontWindow: '#d1da76',
          FrontGlass: '#A88AED',
          FirstLevelWindow: '#d1da76',
          FirstLevelGlass: '#d1da76',
          SecondLevelWindow: '#d1da76',
          SecondLevelGlass: '#d1da76',
          Roof: '#A88AED',
          DoorArch: '#d1da76',
          Ceiling: '#d1da76',
          Foundation: '#d1da76',
          Door: '#d1da76',
          DoorHandle: '#A88AED',
        },
        houseDebugMeshNames: true,
      }}
    >
      <Services />
      <Cards />
    </ServiceLayout>
  )
}

export default Design
