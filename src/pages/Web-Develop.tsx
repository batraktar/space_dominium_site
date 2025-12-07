import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'
import LogoMenu from '../components/LogoMenu'
import Question from '../components/Question'
import WebDevHero from '../components/WebDevHero'
import WebDevServices from '../components/WebDevServices'
import styles from './web-develop.module.scss'

function WebDevelop() {
  return (
    <div className={styles.webDevelop}>
      <LogoMenu/>
      <WebDevHero />
      <WebDevServices />
      <Question
        sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=338318137&single=true&output=csv"
        plusColor="#B5CAFF"
        titleColor="#B5CAFF"
      />
      <ContactUs
        formBg="rgba(181, 202, 255, 0.15)"
        inputBorder="#FFC3CC"
        buttonBg="#FFC3CC"
      />
      <Footer
        title={<>Роботи не захоплять світ, <br/>
        бо ми ними керуємо</>}
        titleColor="#FFF"
        buttonLabel="почати співпрацю"
        btnTextColor="#FFB2F7"
        underlineColor="#FFF"
        arrowCircleColor="#FFF"
        arrowColor="#FFB2F7"
      />
    </div>
  )
}

export default WebDevelop