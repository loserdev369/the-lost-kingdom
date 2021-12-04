import React from 'react'
import styled from '@emotion/styled'
import mintText from '../assets/pages/mint/mint-coming-soon.png'
import mintAvatars from '../assets/pages/mint/mint-coming-soon-sillouete.png'

const SectionWrapper = styled.div`
  border-top: solid 7px #46604F;
  background: url(${mintAvatars}) center center;
  background-size: 80%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const ImgWrapper = styled.img``

export default function Mint() {
  return (
    <SectionWrapper>
      <bgTexture />
      <ImgWrapper src={mintText} />
    </SectionWrapper>
  )
}
