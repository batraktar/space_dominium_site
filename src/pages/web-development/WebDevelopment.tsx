import ServiceLayout from '../../shared/layout/ServiceLayout'
import { appEnv } from '../../shared/config/app-env'
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
        sheetUrl: appEnv.faqWebSheetUrl,
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
        houseShadowLift: 0.35,
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
      <Benefits
        iconColor="#B5CAFF"
        iconHoverColor="#FFC2CB"
        iconThickness={0}
        iconThicknessScale={1.5}
        iconThicknessById={{
          1: 0.4,
          6: 0.25,
        }}
        iconSizeById={{
          2: 85,
          4: 85,
        }}

        iconColorsById={{
          1: '#B5CAFF', //+
          2: '#ffb2f7', //+
          3: '#cbd83b', //+
          4: '#cbd83b', //+
          5: '#ffb2f7', //+
          6: '#B5CAFF', //+
        }}
      />
      {/* <RegionsLinks tone="dark" /> */}
    </ServiceLayout>
  )
}

export default WebDevelopment
