import { useRef, useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import title from '../assets/pages/roadmap/roadmap-title.png'
import presale from '../assets/pages/roadmap/presale-title-box.png'
import presaleText from '../assets/pages/roadmap/roadmap-presale-bullets.png'
import earlyAccess from '../assets/pages/roadmap/early-access.png'
import earlyAccessText from '../assets/pages/roadmap/early-access-bullets.png'
import middleBanner from '../assets/pages/roadmap/roadmap-mid-illustration.png'
import footerBanner from '../assets/pages/roadmap/TLK-roadmap-footer-banner.png'
import stage1 from '../assets/pages/roadmap/stage-1.png'
import stage2 from '../assets/pages/roadmap/stage-2.png'
import stage3 from '../assets/pages/roadmap/stage-3.png'
import gameLaunch from '../assets/pages/roadmap/game-launch.png'
import stage1Text from '../assets/pages/roadmap/stage-1-bullets.png'
import stage2Text from '../assets/pages/roadmap/stage-2-bullets.png'
import stage3Text from '../assets/pages/roadmap/stage-3-bullets.png'
import gameLaunchText from '../assets/pages/roadmap/game-launch-bullets.png'
import phase2 from '../assets/pages/roadmap/phase-2.png'
import phase3 from '../assets/pages/roadmap/phase-3.png'
import phase4 from '../assets/pages/roadmap/phase-4.png'
import phase5 from '../assets/pages/roadmap/phase-5.png'
import phase2Text from '../assets/pages/roadmap/phase-2-bullets.png'
import phase3Text from '../assets/pages/roadmap/phase-3-bullets.png'
import phase4Text from '../assets/pages/roadmap/phase-4-bullets.png'
import phase5Text from '../assets/pages/roadmap/phase-5-bullets.png'
import muchMoreText from '../assets/pages/roadmap/much-more-text.png'

const RoadMapWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  & div {
    margin-top: 6vw;
    align-items: center;
  }
`
console.log('styled.div = ', styled.div)


const RoadmapPhase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 7vw;
  max-width: 100%;
  margin: 0 auto;
  ${props => props.first && css`
    display: block;
  `}
`

const RoadmapImg = styled.img`
  @media (max-width: 768px) {
    width: 80vw;
  }
`

const Banner = styled.img`
  min-width: 100%;
  margin-top: 7vw;
`

const Img = styled.img`
  margin: 0;
  justify-self: start;

  @media (max-width: 768px) {
    width: 30vw;
  }

  ${props => props.flipped && css`
    grid-column: 2;
    justify-self: end;
  `}

  ${props => props.moreText && css`
    margin: 10vw auto 0;
    @media (max-width: 768px) {
      width: 60vw;
      margin: 11vw auto 0;
    }
  `}
`

const Text = styled.img`
  margin: 0;
  justify-self: end;
  
  ${props => props.flipped && css`
    grid-column: 1;
    grid-row: 1;  
    justify-self: start;
  `}
  ${props => props.first && css`
    margin: 0 auto;
    margin-top: 3vw;
    @media (max-width: 768px) {
      width: 60vw;
    }
    }
  `}
  ${props => props.stage1 && css`
    @media (max-width: 768px) {
      width: 111px;
    }
    }
  `}
  ${props => props.gameLaunch && css`
    @media (max-width: 768px) {
      width: 140px;
    }
    }
  `}
`

const Title = styled.img`
  margin-top: 4vw;
  @media (max-width: 768px) {
    width: 60vw;
  }
`

export default function Roadmap() {
  const titleRef = useRef()
  const preSaleTitleRef = useRef()
  const preSaleTextRef = useRef()
  const t1 = useRef()
  const r1Image = useRef()
  const r1Text = useRef()
  const r2Image = useRef()
  const r2Text = useRef()
  const r3Image = useRef()
  const r3Text = useRef()
  const r4Image = useRef()
  const r4Text = useRef()
  const r5Image = useRef()
  const r5Text = useRef()

  const middleBannerRef = useRef()

  const r6Image = useRef()
  const r6Text = useRef()
  const r7Image = useRef()
  const r7Text = useRef()
  const r8Image = useRef()
  const r8Text = useRef()
  const r9Image = useRef()
  const r9Text = useRef()

  const footerBannerRef = useRef()
  const muchMoreRef = useRef()

  // idea -> chain all of the refs together and just have one scroll trigger like a domino effect

  useLayoutEffect(() => {
    const roadMap1Refs = [
      r1Image.current,
      r1Text.current,
      r2Image.current,
      r2Text.current,
      r3Image.current,
      r3Text.current,
      r4Image.current,
      r4Text.current,
      r5Image.current,
      r5Text.current
    ]
    const roadMap2Refs = [
      r6Image.current,
      r6Text.current,
      r7Image.current,
      r7Text.current,
      r8Image.current,
      r8Text.current,
      r9Text.current,
      r9Image.current,
      muchMoreRef.current
    ]

    t1.current = gsap.timeline(
      {
        scrollTrigger: {
          trigger: titleRef.current,
          // markers: true,
          toggleActions: 'play none none none',
          start: 'top center',
          ease: 'power1.inOut',
        }
      }
    )
      .from(titleRef.current, { x: 300, opacity: 0 })
      .from([preSaleTitleRef.current, preSaleTextRef.current], { x: -300, opacity: 0, stagger: 0.3 })
      .from(roadMap1Refs, { x: 300, opacity: 0, stagger: 0.4 })

    gsap.from(middleBannerRef.current, {
      scrollTrigger: {
        trigger: middleBannerRef.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      },
      y: 100,
      opacity: 0,
      ease: 'power2.inOut',
    })

    gsap.from(roadMap2Refs, {
      scrollTrigger: {
        trigger: r6Image.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      },
      x: 100,
      opacity: 0,
      ease: 'power2.inOut',
      stagger: 0.4
    })

    gsap.from(footerBannerRef.current, {
      scrollTrigger: {
        trigger: footerBannerRef.current,
        // markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      },
      y: 100,
      opacity: 0,
      ease: 'power2.inOut',
    })

  }, [])


  return (
    <>
      <RoadMapWrapper>

        <Title ref={titleRef} src={title} />

        <RoadmapPhase first>
          <RoadmapImg ref={preSaleTitleRef} first src={presale} />
          <Text ref={preSaleTextRef} first src={presaleText} />
        </RoadmapPhase>

        <RoadmapPhase>
          <Img ref={r1Image} src={earlyAccess} />
          <Text ref={r1Text} src={earlyAccessText} />
        </RoadmapPhase>

        {/* stage 1  */}
        <RoadmapPhase>
          <Img ref={r2Image} flipped src={stage1} />
          <Text ref={r2Text} stage1 flipped src={stage1Text} />
        </RoadmapPhase>

        {/* stage 2  */}
        <RoadmapPhase>
          <Img ref={r3Image} src={stage2} />
          <Text ref={r3Text} src={stage2Text} />
        </RoadmapPhase>

        {/* stage 3  */}
        <RoadmapPhase>
          <Img ref={r4Image} flipped src={stage3} />
          <Text ref={r4Text} flipped src={stage3Text} />
        </RoadmapPhase>

        {/* Game Launch  */}
        <RoadmapPhase>
          <Img ref={r5Image} src={gameLaunch} />
          <Text ref={r5Text} gameLaunch src={gameLaunchText} />
        </RoadmapPhase>
      </RoadMapWrapper>

      <Banner ref={middleBannerRef} src={middleBanner} />

      <RoadMapWrapper>

        {/* Phase 2 */}
        <RoadmapPhase>
          <Img ref={r6Image} flipped src={phase2} />
          <Text ref={r6Text} flipped src={phase2Text} />
        </RoadmapPhase>

        {/* Phase 3  */}
        <RoadmapPhase>
          <Img ref={r7Image} src={phase3} />
          <Text ref={r7Text} src={phase3Text} />
        </RoadmapPhase>

        {/* Phase 4  */}
        <RoadmapPhase>
          <Img ref={r8Image} flipped src={phase4} />
          <Text ref={r8Text} flipped src={phase4Text} />
        </RoadmapPhase>

        {/* Phase 5  */}
        <RoadmapPhase>
          <Img ref={r9Image} src={phase5} />
          <Text ref={r9Text} src={phase5Text} />
        </RoadmapPhase>

        {/* and much more to come */}
        <Img ref={muchMoreRef} moreText src={muchMoreText} />

      </RoadMapWrapper>
      <Banner ref={footerBannerRef} src={footerBanner} />
    </>
  )
}

