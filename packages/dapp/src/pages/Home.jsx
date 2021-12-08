import React from 'react'
import Mint from "../components/Mint.jsx"
import styled from '@emotion/styled'
import bgTexture from '../assets/pages/mint/bg-texture.png'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Roadmap from '../components/Roadmap.jsx'
import Team from '../components/Team.jsx'
import FAQ from '../components/Faq.jsx'
import Footer from '../components/Footer.jsx'
import { Provider } from '../context/Provider.jsx'
import GlobalStyles from '../components/Providers/Global.jsx'

const HomeWrap = styled.div`
  background: url(${bgTexture});
  background-attachment: fixed;
`

function Home() {


  return (
    <HomeWrap>
      <Provider>
        <GlobalStyles>
          <Hero />
          <Mint />
          <About />
          <Roadmap />
          <Team />
          <FAQ />
          <Footer />
        </GlobalStyles>
      </Provider>
    </HomeWrap>
  )
}

export default Home;
