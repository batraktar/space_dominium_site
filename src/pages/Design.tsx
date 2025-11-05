import ContactUs from "../components/ContactUs"
import Footer from "../components/Footer"
import Menu from "../components/LogoMenu"
import Question from "../components/Question"


function Design() {
  return (
    <div className="wrapper">
      <Menu/>
        <Question
          sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub?gid=1925531033&single=true&output=csv"
          plusColor="#B5CAFF"
          titleColor="#B5CAFF"
        />
        <ContactUs
          formBg="rgba(0, 0, 0, 0.10)"
          inputBorder="#CBD83B"
          buttonBg="#CBD83B"
        />
        <Footer
          titleColor="#000"
          buttonLabel="почати співпрацю"
          btnTextColor="#CBD83B"
          underlineColor="#000"
          arrowColor="#CBD83B"
          arrowCircleColor="#000"
        />

    </div>
  )
}

export default Design