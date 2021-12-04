import React from 'react'
import NavBar from "../components/NavBar.jsx"
import styled from '@emotion/styled'
import TLKTitle from '../assets/pages/hero/the-lost-kingdom.png'
import TLKIntroText from '../assets/pages/hero/once-upon-a-time.png'
import LearnMoreBtn from '../assets/pages/hero/learn-more-btn.png'
import TLKBG from '../assets/pages/hero/hero-bg-image.png'

const BG = styled.div`
  background: url(${TLKBG}) center center ;
  background-size: cover;
  height: 100vh;
`

const MiddleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`

const Title = styled.img``
const IntroText = styled.img``
const LearnMore = styled.img``

function Home() {
  return (
    <BG>
      <NavBar />
      <MiddleSection>
        <div>
          <Title src={TLKTitle} />
          <IntroText src={TLKIntroText} />
          <LearnMore src={LearnMoreBtn} />
        </div>
      </MiddleSection>
    </ BG>
  )
}

export default Home;
