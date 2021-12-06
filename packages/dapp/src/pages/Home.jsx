import React from 'react'
import Mint from "../components/Mint.jsx"
import styled from '@emotion/styled'
import { Global, css } from "@emotion/react"
import bgTexture from '../assets/pages/mint/bg-texture.png'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Roadmap from '../components/Roadmap.jsx'
import Team from '../components/Team.jsx'
import FAQ from '../components/Faq.jsx'
import Footer from '../components/Footer.jsx'
import { Provider } from '../context/Provider.jsx'

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
      <Provider>
        <Hero />
        <Mint />
        <About />
        <Roadmap />
        <Team />
        <FAQ />
        <Footer />
      </Provider>
    </HomeWrap>
  )
}

export default Home;
