import { useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import NavBar from "../components/NavBar.jsx"
import TLKTitle from '../assets/pages/hero/the-lost-kingdom.png'
import TLKIntroText from '../assets/pages/hero/once-upon-a-time.png'
import LearnMoreBtn from '../assets/pages/hero/learn-more-btn.png'
import TLKBG from '../assets/pages/hero/hero-bg-image.png'
import { gsap } from 'gsap'

const HeroWrap = styled.div`
  background: url(${TLKBG}) center center ;
  background-size: cover;
  height: 100vh;
  display: grid;
  grid-template-rows: 10% 90%;
  @media screen and (max-width: 768px) {
    height: 600px
  }
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
  @media screen and (max-width: 768px) {
    width: 80vw;
  }

`
const IntroText = styled.img`
  margin: 0;
  @media screen and (max-width: 1440px) {
    width: 60vw;
  }
  @media screen and (max-width: 768px) {
    width: 80vw;
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

export default function Hero() {
  const titleRef = useRef();
  const introTextRef = useRef();
  const learnMoreRef = useRef();

  useEffect(() => {
    const refs = [
      titleRef.current,
      introTextRef.current,
      learnMoreRef.current
    ]
    gsap.from(refs, { stagger: 0.3, x: -300, opacity: 0, delay: 1.4 })
  }, [])

  return (
    <HeroWrap>
      <NavBar />
      <MiddleSection>
        <div>
          <Title ref={titleRef} src={TLKTitle} />
          <IntroText ref={introTextRef} src={TLKIntroText} />
          <LearnMore ref={learnMoreRef} src={LearnMoreBtn} />
        </div>
      </MiddleSection>
    </HeroWrap>
  )
}
