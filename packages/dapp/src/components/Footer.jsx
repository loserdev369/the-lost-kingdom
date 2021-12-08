import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import leftDarkElf from '../assets/pages/footer/dark-elf-left.png'
import rightDarkElf from '../assets/pages/footer/dark-elf-right.png'
import followUs from '../assets/pages/footer/follow-us-title.png'
import subText from '../assets/pages/footer/follow-us-sub-text.png'
import discord from '../assets/pages/footer/footer-discord.png'
import twitter from '../assets/pages/footer/footer-twitter.png'

const TestWrap = styled.div`
  color: white;
  font-size: 100px;
  // & * {
  //   font-size: 100px;
  // }
`


const FooterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  margin-top: 9vw;
  padding-bottom: 6vw;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
const MiddleSection = styled.div`
  @media screen and (max-width: 768px) {
    grid-row: 1;
  }
`
const TextWrap = styled.div`
  margin-bottom: 3vw;
`
const Title = styled.img`
  @media screen and (max-width: 768px) {
    width: 70vw;
  }
`
const SubText = styled.img`
  @media screen and (max-width: 768px) {
    width: 90vw;
    margin-bottom: 6vw;
  }
`
const DarkElf = styled.img`
  ${props => props.right && css`
    @media screen and (max-width: 768px) {
      display: none;
    }
  `}
  ${props => props.left && css`
    @media screen and (max-width: 768px) {
      grid-row: 2;
      width: 50vw;
    }
  `}
`
const SocialWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2,1fr)
`
const SocialIcon = styled.img`
  cursor: pointer;
  @media screen and (max-width: 768px) {
    align-self: center;
    width: 15vw;
  }
`


export default function Footer() {
  const wrapperRef = useRef()
  const titleRef = useRef()
  const subTextRef = useRef()
  const discordRef = useRef()
  const twitterRef = useRef()
  const darkElfLeftRef = useRef()
  const darkElfRightRef = useRef()
  const t1 = useRef()

  useLayoutEffect(() => {
    const refs = [
      darkElfLeftRef.current,
      titleRef.current,
      subTextRef.current,
      discordRef.current,
      twitterRef.current,
      darkElfRightRef.current
    ]

    t1.current = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
        // markers: true
      }
    })
      .from(refs, { x: -90, opacity: 0, stagger: 0.2, duration: 1 })
  }, [])


  return (
    <FooterWrapper ref={wrapperRef}>
      <DarkElf ref={darkElfLeftRef} left src={leftDarkElf} />
      <MiddleSection>
        <TextWrap>
          <Title ref={titleRef} src={followUs} />
          <SubText ref={subTextRef} src={subText} />
        </TextWrap>
        <SocialWrap>
          <SocialIcon ref={discordRef} src={discord} />
          <SocialIcon ref={twitterRef} src={twitter} />
        </SocialWrap>
      </MiddleSection>
      <DarkElf ref={darkElfRightRef} right src={rightDarkElf} />
      <TestWrap>
        <h1>Heading Test</h1>
        <p>Body Test</p>
      </TestWrap>
    </ FooterWrapper>
  )
}
