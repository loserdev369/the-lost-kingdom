import { useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import mintText from '../assets/pages/mint/mint-coming-soon.png'
import mintAvatars from '../assets/pages/mint/mint-coming-soon-sillouete.png'
import { gsap } from 'gsap'

const SectionWrapper = styled.div`
  border-top: solid 7px #46604F;
  background: url(${mintAvatars}) center center;
  background-size: 80%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  @media (max-width: 1400px) {
    background-size: cointain;
  }
  @media (max-width: 768px) {
    height: 60vw;
  }
;
`

const ImgWrapper = styled.img`
  @media (max-width: 1400px) {
    width: 30vw;
  }
`

export default function Mint() {

  const bgImageRef = useRef();
  const mintTextRef = useRef();

  // add scrollTrigger to active animations on scroll

  useEffect(() => {
    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: bgImageRef.current,
        markers: false,
        toggleActions: 'play none none none',
        start: '20% center',
        ease: 'power1.inOut',
      }
    })
    t1.from(mintTextRef.current, { y: 500, opacity: 0 })
  }, [])

  return (
    <SectionWrapper ref={bgImageRef}>
      <ImgWrapper ref={mintTextRef} src={mintText} />
    </SectionWrapper>
  )
}
