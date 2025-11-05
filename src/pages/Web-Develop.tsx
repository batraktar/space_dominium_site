import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'
import LogoMenu from '../components/LogoMenu'
import Question from '../components/Question'
import Talk from '../components/Talk'



function WebDevelop() {
  return (
    <div className="wrapper">
      <LogoMenu/>
      <Talk
        text="Ваш проєкт заслуговує на більше, ніж шаблон з інтернету. 
        Давайте створимо кастомне рішення, яке справді працює."
        ctaLabel="Поговоримо про проєкт"
        textColor="#0A0A60"
        btnTextSizePx={30}
        btnTextColor="#FFF"
        btnBg="#0A0A60"
        gradient={`conic-gradient(
          from -10deg at 50% 75.57%, 
          #B5CAFF 38.09129744768143deg, 
          #FFB2F7 122.90465354919434deg, 
          #0A0A60 219.8341941833496deg,
          #B5CAFF 358.09129744768143deg 
        )`}
        />
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