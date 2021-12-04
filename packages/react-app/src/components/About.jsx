import React from 'react'
import styled from '@emotion/styled'
import aboutText from '../assets/pages/about/about-text.png'
import titleText from '../assets/pages/about/about-kingdoms.png'
import aboutPoster from '../assets/pages/about/TLK-Poster.png'

const Wrap = styled.div``

const SectionWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const TextWrap = styled.img``
const TitleText = styled.img`
  margin: 6rem auto;
`
const TitleWrap = styled.div`
  text-align: center;
`
const AboutPosterWrap = styled.img``


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
    </Wrap>
  )
}




