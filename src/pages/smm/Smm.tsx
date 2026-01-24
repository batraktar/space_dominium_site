import ServiceLayout from '../../shared/layout/ServiceLayout'
import Hero from './components/Hero'
import ChoosePlan from './components/ChoosePlan'
import Tools from './components/Tools'

import styles from './smm.module.scss'

function Smm() {
  return (
    <ServiceLayout
      className={styles.smm}
      hero={<Hero />}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1942219183&single=true&output=csv',
        plusColor: '#FFCDC3',
        titleColor: '#FFCDC3',
      }}
      contact={{
        formBg: 'rgba(255, 255, 255, 0.20)',
        inputBorder: '#FFCDC3',
        buttonBg: '#FFCDC3',
      }}
      footer={{
        title: (
          <>
            Давай створимо контент, <br />
            який не соромно показати
          </>
        ),
        titleColor: '#FFF',
        buttonLabel: 'почати співпрацю',
        btnTextColor: '#FFC3CC',
        underlineColor: '#FFF',
        arrowCircleColor: '#FFF',
        arrowColor: '#FFC3CC',
      }}
    >
      <Tools />
      <ChoosePlan />
    </ServiceLayout>
  )
}

export default Smm
