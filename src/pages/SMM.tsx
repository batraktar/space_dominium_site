import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'
import LogoMenu from '../components/LogoMenu'
import Question from '../components/Question'
import Talk from '../components/Talk'



import SmmTools from '../components/SmmTools'
import SmmChoosePlan from '../components/SmmChoosePlan'

import styles from './smm.module.scss'

function SMM() {
  return (
    <div className={styles.smm}>
      <LogoMenu />
      <Talk
        text="Ваш бренд заслуговує на більше, ніж 10 лайків від друзів! Поговоримо про те, як зробити ваші соцмережі живими."
        ctaLabel="Давайте створювати ♡"
        textColor="#28301C"
        btnTextSizePx={24}
        btnTextColor="#FFC3CC"
        btnBg="#28301C"
        gradient={`conic-gradient(
            from -12deg at 48.46% 74%, 
            #D3DB76 100.38461208343506deg, 
            #FFCDC3 141.9230818748474deg, 
            #FFCDC3 281.60184144973755deg, 
            #D3DB76 358.3087491989136deg
        )`}
        />
        <SmmTools />
        <SmmChoosePlan />
        <Question
          sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1942219183&single=true&output=csv"
          plusColor="#FFCDC3"
          titleColor="#FFCDC3"
        />
        <ContactUs
          formBg="rgba(255, 255, 255, 0.20)"
          inputBorder="#FFCDC3"
          buttonBg="#FFCDC3"
        />
        <Footer
          title={<>Давай створимо контент, <br/>
          який не соромно показати</>}
          titleColor="#FFF"
          buttonLabel="почати співпрацю"
          btnTextColor="#FFC3CC"
          underlineColor="#FFF"
          arrowCircleColor="#FFF"
          arrowColor="#FFC3CC"
        />
    </div>
  )
}

export default SMM
