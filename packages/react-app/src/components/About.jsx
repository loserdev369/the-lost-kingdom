import React from 'react'
import styled from '@emotion/styled'
import aboutText from '../assets/pages/about/about-text.png'
import titleText from '../assets/pages/about/about-kingdoms.png'
import aboutPoster from '../assets/pages/about/TLK-Poster.png'
import tlkMap from '../assets/pages/about/TLK-world-map.png'

const TLKMap = styled.img`
  width: 100%;
  margin: 3rem 0;
`

const Wrap = styled.div``

const SectionWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const TextWrap = styled.img`
  @media screen and (max-width: 768px) {
    width: 80vw; 
  }

`
const TitleText = styled.img`
  margin: 6vw auto;
  @media screen and (max-width: 768px) {
    width: 80vw;
    margin-bottom: 0; 
  }
`
const TitleWrap = styled.div`
  text-align: center;
`
const AboutPosterWrap = styled.img`
  width: 47vw;
  @media screen and (max-width: 1440px) {
    width: 60vw; 
  }
  @media screen and (max-width: 768px) {
    width: 90vw; 
    order: -1;
  }
`


export default function About() {
  return (
    <Wrap>
      <TitleWrap>
        <TitleText src={titleText} />
      </TitleWrap>
      <SectionWrap>
        <TextWrap src={aboutText} />
        <AboutPosterWrap src={aboutPoster} />
      </SectionWrap>
      <TLKMap src={tlkMap} />
    </Wrap>
  )
}

