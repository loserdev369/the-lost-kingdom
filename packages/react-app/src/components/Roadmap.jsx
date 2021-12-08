import React from 'react'
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
import muchMoreText from '../assets/pages/roadmap/much-more-text-lighter.png'

const RoadMapWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  & div {
    margin-top: 6vw;
    align-items: center;
  }
`

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
  return (
    <>
      <RoadMapWrapper>

        <Title src={title} />

        <RoadmapPhase first>
          <RoadmapImg first src={presale} />
          <Text first src={presaleText} />
        </RoadmapPhase>

        <RoadmapPhase>
          <Img src={earlyAccess} />
          <Text src={earlyAccessText} />
        </RoadmapPhase>

        {/* stage 1  */}
        <RoadmapPhase>
          <Img flipped src={stage1} />
          <Text stage1 flipped src={stage1Text} />
        </RoadmapPhase>

        {/* stage 2  */}
        <RoadmapPhase>
          <Img src={stage2} />
          <Text src={stage2Text} />
        </RoadmapPhase>

        {/* stage 3  */}
        <RoadmapPhase>
          <Img flipped src={stage3} />
          <Text flipped src={stage3Text} />
        </RoadmapPhase>

        {/* Game Launch  */}
        <RoadmapPhase>
          <Img src={gameLaunch} />
          <Text gameLaunch src={gameLaunchText} />
        </RoadmapPhase>
      </RoadMapWrapper>

      <Banner src={middleBanner} />
      <RoadMapWrapper>

        {/* Phase 2 */}
        <RoadmapPhase>
          <Img flipped src={phase2} />
          <Text flipped src={phase2Text} />
        </RoadmapPhase>

        {/* Phase 3  */}
        <RoadmapPhase>
          <Img src={phase3} />
          <Text src={phase3Text} />
        </RoadmapPhase>

        {/* Phase 4  */}
        <RoadmapPhase>
          <Img flipped src={phase4} />
          <Text flipped src={phase4Text} />
        </RoadmapPhase>

        {/* Phase 5  */}
        <RoadmapPhase>
          <Img src={phase5} />
          <Text src={phase5Text} />
        </RoadmapPhase>

        {/* and much more to come */}
        <Img moreText src={muchMoreText} />

      </RoadMapWrapper>
      <Banner src={footerBanner} />
    </>
  )
}

