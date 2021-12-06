import { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import aboutText from '../assets/pages/about/about-text.png'
import titleText from '../assets/pages/about/about-kingdoms.png'
import aboutPoster from '../assets/pages/about/TLK-Poster.png'
import tlkMap from '../assets/pages/about/TLK-world-map.png'
import { gsap } from 'gsap'

const TLKMap = styled.img`
  width: 100%;
  margin: 3rem 0;
`

const Wrap = styled.div`
`

const SectionWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 6vw;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const TextWrap = styled.img`
  width: 44vw;
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
  width: 40vw;
  @media screen and (max-width: 1440px) {
    width: 60vw; 
  }
  @media screen and (max-width: 768px) {
    width: 90vw; 
    order: -1;
  }
`


export default function About() {

  const wrapRef = useRef();
  const titleRef = useRef();
  const aboutTextRef = useRef();
  const posterRef = useRef();
  const worldMapRef = useRef();

  // add scrollTrigger to active animations on scroll

  useEffect(() => {
    const refs = [titleRef.current, aboutTextRef.current, posterRef.current]
    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      }
    })


    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: worldMapRef.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top 50%',
        ease: 'power1.inOut',
      }
    })
    t1.from(refs, { x: 300, opacity: 0, stagger: 0.3, duration: 1 })
    t2.from(worldMapRef.current, { x: -300, opacity: 0, duration: 1 })
    console.log('something to refresh')
  }, [])
  return (
    <Wrap ref={wrapRef}>
      <TitleWrap>
        <TitleText ref={titleRef} src={titleText} />
      </TitleWrap>
      <SectionWrap>
        <TextWrap ref={aboutTextRef} src={aboutText} />
        <AboutPosterWrap ref={posterRef} src={aboutPoster} />
      </SectionWrap>
      <TLKMap ref={worldMapRef} src={tlkMap} />
    </Wrap>
  )
}

