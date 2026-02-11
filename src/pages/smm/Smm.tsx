import ServiceLayout from '../../shared/layout/ServiceLayout'
import Hero from './components/Hero'
import ChoosePlan from './components/ChoosePlan'
import Tools from './components/Tools'
import styles from './smm.module.scss'

function Smm() {
  return (
    <ServiceLayout
    affix={{
      burgerColor: 'var(--blush-rose)',
      contactButtonBg: 'var(--blush-rose)',
      contactButtonTextColor: 'var(--deep-olive)',
      contactButtonLiftMobilePx: 20,
    }}
      className={styles.smm}
      hero={<Hero />}
      faq={{
        sheetUrl:
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1942219183&single=true&output=csv',
        plusColor: '#FFCDC3',
        titleColor: '#FFCDC3',
        textColor: '#FFF',
      }}
      contact={{
        formBg: 'rgba(255, 255, 255, 0.20)',
        inputBorder: '#ffc2cb',
        buttonBg: '#ffc2cb',
        textColor: '#fff',

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
        btnTextColor: '#ffc2cb',
        underlineColor: '#FFF',
        arrowCircleColor: '#FFF',
        arrowColor: '#ffc2cb',
        menuTextColor: '#fff',
        phoneColor: '#FFFFFF',
        housePartColors: {
          Floor: '#fdeb9f',
          Walls: '#ffc2cb',
          FrontWindow: '#ffc2cb',
          FrontGlass: '#fdeb9f',
          FirstLevelWindow: '#ffc2cb',
          FirstLevelGlass: '#ffc2cb',
          SecondLevelWindow: '#ffc2cb',
          SecondLevelGlass: '#ffc2cb',
          Roof: '#fdeb9f',
          DoorArch: '#ffc2cb',
          Ceiling: '#ffc2cb',
          Foundation: '#ffc2cb',
          Door: '#ffc2cb',
          DoorHandle: '#fdeb9f',
        },
      }}
    >
      <Tools />
      <ChoosePlan 
      iconColor="#ffc2cb"
      />
    </ServiceLayout>
  )
}

export default Smm
