import ContactUs from "../components/ContactUs"
import Footer from "../components/Footer"
import Menu from "../components/LogoMenu"
import Question from "../components/Question"
import Bubbles from "../components/ui/ContactButton/Bubbles"
import DotsBg from "../components/ui/ContactButton/DotsBG"
import Services from "../components/Services"
import Quote from "../components/Quote"

import FloatingShapes from "../components/ui/FloatingShapes"


function Design() {
  return (
    <div className="wrapper">
      <Menu/>
      <DotsBg bgColor="#7E6AF6" dotColor="rgba(255,255,255,.5)" className="w-full" style={{ minHeight: "100vh", position: "relative" }}>
        <FloatingShapes />
        <Bubbles
        bubbleContent={{
          b1: "Логотипи",
          b2: "Айдентика",
          b3: "Веб-дизайн",
          b4: "Типографія",
          b5: "Упаковка",
          // b6..b10 з'являться на 1024-му брейкпоінті
        }}
      />
      </DotsBg>
      <Services />
      <Quote />

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