import ServiceLayout from '../../shared/layout/ServiceLayout'
import Benefits from './components/Benefits'
import Hero from './components/Hero'
import Services from './components/Services'
import Showcase from './components/Showcase'
import styles from './web-development.module.scss'

function WebDevelopment() {
  return (
    <ServiceLayout
    affix={{
      contactButtonBg: 'var(--sky-blue)',
      burgerColor: 'var(--sky-blue)',
      contactButtonTextColor: 'var(--deep-anthracite)',
      contactButtonLiftMobilePx: 20,
    }}
      className={styles.webDevelop}
      hero={<Hero />}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=338318137&single=true&output=csv',
        plusColor: '#B5CAFF',
        titleColor: '#B5CAFF',
        textColor: '#FFF',
      }}
      contact={{
        formBg: 'rgba(181, 202, 255, 0.15)',
        inputBorder: 'var(--candy-pink)',
        buttonBg: 'var(--candy-pink)',
        textColor: '#FFFFFF',
      }}
      footer={{
        title: (
          <>
            Роботи не захоплять світ, <br />
            бо ми ними керуємо
          </>
        ),
        titleColor: '#FFFFFF',
        buttonLabel: 'почати співпрацю',
        phoneColor: '#FFFFFF',
        menuTextColor: '#FFFFFF',
        btnTextColor: '#FFB2F7',
        underlineColor: '#FFF',
        arrowCircleColor: '#FFF',
        arrowColor: '#FFB2F7',
        housePartColors: {
          Floor: '#b5caff',
          Walls: '#ffb2f7',
          FrontWindow: '#ffb2f7',
          FrontGlass: '#b5caff',
          FirstLevelWindow: '#ffb2f7',
          FirstLevelGlass: '#ffb2f7',
          SecondLevelWindow: '#ffb2f7',
          SecondLevelGlass: '#ffb2f7',
          Roof: '#b5caff',
          DoorArch: '#ffb2f7',
          Ceiling: '#ffb2f7',
          Foundation: '#ffb2f7',
          Door: '#ffb2f7',
          DoorHandle: '#b5caff',
        },
        houseDebugMeshNames: true,
      }}
    >
      <Services />
      <Showcase />
      <Benefits />
    </ServiceLayout>
  )
}

export default WebDevelopment
