import React from 'react'
import NavBar from "../components/NavBar.jsx"
import Mint from "../components/Mint.jsx"
import styled from '@emotion/styled'
import { Global, css } from "@emotion/react"
import TLKTitle from '../assets/pages/hero/the-lost-kingdom.png'
import TLKIntroText from '../assets/pages/hero/once-upon-a-time.png'
import LearnMoreBtn from '../assets/pages/hero/learn-more-btn.png'
import TLKBG from '../assets/pages/hero/hero-bg-image.png'
import bgTexture from '../assets/pages/mint/bg-texture.png'
import About from '../components/About.jsx'
import Roadmap from '../components/Roadmap.jsx'

const Hero = styled.div`
  background: url(${TLKBG}) center center ;
  background-size: cover;
  height: 100vh;
  display: grid;
  grid-template-rows: 10% 90%;
`

const MiddleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-left: 3rem;
`

const Title = styled.img`
  @media screen and (max-width: 1440px) {
    width: 63vw;
  }

`
const IntroText = styled.img`
  margin: 0;
  @media screen and (max-width: 1440px) {
    width: 60vw;
  }
`
const LearnMore = styled.img`
  cursor: pointer;
  margin: 0;
  margin-top: 3rem;
  @media screen and (max-width: 1440px) {
    width: 20vw;
  }
`

const HomeWrap = styled.div`
  background: url(${bgTexture});
  background-attachment: fixed;
`

function Home() {
  return (
    <HomeWrap>
      <Global
        styles={css`
          body {
            background: linear-gradient(180deg, rgba(34,63,43,1) 0%, rgba(73,161,132,1) 50%, rgba(34,63,43,1) 100%);
            position: relative;
          }
          img {
            margin: 0 auto;
          }
        `}
      />
      <Hero>
        <NavBar />
        <MiddleSection>
          <div>
            <Title src={TLKTitle} />
            <IntroText src={TLKIntroText} />
            <LearnMore src={LearnMoreBtn} />
          </div>
        </MiddleSection>
      </ Hero>
      <Mint />
      <About />
      <Roadmap />
    </HomeWrap>
  )
}

export default Home;
