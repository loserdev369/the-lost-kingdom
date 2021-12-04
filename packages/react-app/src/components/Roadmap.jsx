import React from 'react'
import styled from '@emotion/styled'
import title from '../assets/pages/roadmap/roadmap-title.png'
const RoadMapWrapper = styled.div`
  text-align: center;
`
const RoadmapPhase = styled.div``
const Img = styled.img``
const Text = styled.img``
const Title = styled.img`
  margin: 0 auto;
`

export default function Roadmap() {
  return (
    <>
      <RoadMapWrapper>
        <Title src={title} />
        <RoadmapPhase first>
          {/* This is where i input a phase */}
        </RoadmapPhase>
      </RoadMapWrapper>
    </>
  )
}
