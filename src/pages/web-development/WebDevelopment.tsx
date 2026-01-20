import ServiceLayout from '../../shared/layout/ServiceLayout'
import Benefits from './components/Benefits'
import Hero from './components/Hero'
import Services from './components/Services'
import Showcase from './components/Showcase'
import styles from './web-development.module.scss'

function WebDevelopment() {
  return (
    <ServiceLayout
      className={styles.webDevelop}
      hero={<Hero />}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=338318137&single=true&output=csv',
        plusColor: '#B5CAFF',
        titleColor: '#B5CAFF',
      }}
      contact={{
        formBg: 'rgba(181, 202, 255, 0.15)',
        inputBorder: '#FFC3CC',
        buttonBg: '#FFC3CC',
      }}
      footer={{
        title: (
          <>
            Роботи не захоплять світ, <br />
            бо ми ними керуємо
          </>
        ),
        titleColor: '#FFF',
        buttonLabel: 'почати співпрацю',
        btnTextColor: '#FFB2F7',
        underlineColor: '#FFF',
        arrowCircleColor: '#FFF',
        arrowColor: '#FFB2F7',
      }}
    >
      <Services />
      <Showcase />
      <Benefits />
    </ServiceLayout>
  )
}

export default WebDevelopment
