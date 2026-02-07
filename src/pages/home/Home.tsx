import Header from './components/Header'
import Slider from './components/Slider'
import Animation from './components/animation/Animation'
import HeroCta from '../../shared/sections/hero-cta/HeroCta'
import Contact from '../../shared/sections/contact/Contact'
import Faq from '../../shared/sections/faq/Faq'
import Footer from '../../shared/sections/footer/Footer'
import './home.scss'
import '../../styles/variables.scss'

function Home() {
  return (
    <div className="wrapper">
      <Header 
      contactButtonBg="var(--indigo)"
      contactButtonTextColor="#fff"
      burgerColor="var(--indigo)"
      />
      <main className="page">
        <div className="page__container home__container">
          <Slider />
          <HeroCta
            text={<>Досить гуглити інші агенції. Поговоріть з нами. Напишіть прямо зараз!</>}
            ctaLabel="Звʼязатись ♡"
          />
          <Animation
            categoryOverrides={{
              social: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--blush-rose)',
                contentBg: 'var(--deep-olive)',
                contentBorder: 'var(--blush-rose)',
                subIconColors: ['var(--indigo)', 'var(--pearl)', 'var(--blush-rose)'],
              },
              brandStyle: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--ivory)',
                contentBg: 'var(--indigo)',
                contentBorder: 'var(--ivory)',
                subIconColors: ['var(--pearl)', 'var(--indigo)', 'var(--ivory)'],
              },
              sites: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--deep-anthracite)',
                contentBg: 'var(--candy-pink)',
                contentBorder: 'var(--deep-anthracite)',
                subIconColors: ['var(--candy-pink)', 'var(--sky-blue)'],
              },
              retail: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--deep-anthracite)',
                contentBg: 'var(--sky-blue)',
                contentBorder: 'var(--deep-anthracite)',
                subIconColors: ['var(--candy-pink)', 'var(--sky-blue)', 'var(--lime-green)'],
              },
              apps: {
                navIconColor: 'var(--indigo)',
                contentIconColor: 'var(--ivory)',
                contentBg: 'var(--indigo)',
                contentBorder: 'var(--ivory)',
                subIconColors: ['var(--sky-blue)', 'var(--candy-pink)', 'var(--lime-green)'],
              },
            }}
          />
          <Faq
            sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=0&single=true&output=csv"
            plusColor="#A88AED"
            titleColor="#A88AED"
            textColor="#000"
          />
          <Contact />
        </div>
      </main>
      <Footer
        title={<>Почнемо щось круте?</>}
        titleColor="#000"
        buttonLabel="почати співпрацю"
        btnTextColor="#A88AED"
        underlineColor="#000"
        arrowCircleColor="#000"
        arrowColor="#A88AED"
        housePartColors={{
          Floor: '#d1da76',
          Walls: '#A88AED',
          FrontWindow: '#A88AED',
          FrontGlass: '#d1da76',
          FirstLevelWindow: '#A88AED',
          FirstLevelGlass: '#A88AED',
          SecondLevelWindow: '#A88AED',
          SecondLevelGlass: '#A88AED',
          Roof: '#d1da76',
          DoorArch: '#A88AED',
          Ceiling: '#A88AED',
          Foundation: '#A88AED',
          Door: '#A88AED',
          DoorHandle: '#d1da76',
        }}
        houseDebugMeshNames
      />
    </div>
  )
}

export default Home
