import styled from '@emotion/styled'
import { css } from '@emotion/react'
import leftDarkElf from '../assets/pages/footer/dark-elf-left.png'
import rightDarkElf from '../assets/pages/footer/dark-elf-right.png'
import followUs from '../assets/pages/footer/follow-us-title.png'
import subText from '../assets/pages/footer/follow-us-sub-text.png'
import discord from '../assets/pages/footer/footer-discord.png'
import twitter from '../assets/pages/footer/footer-twitter.png'


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
  return (
    <FooterWrapper>
      <DarkElf left src={leftDarkElf} />
      <MiddleSection>
        <TextWrap>
          <Title src={followUs} />
          <SubText src={subText} />
        </TextWrap>
        <SocialWrap>
          <SocialIcon src={discord} />
          <SocialIcon src={twitter} />
        </SocialWrap>
      </MiddleSection>
      <DarkElf right src={rightDarkElf} />
    </ FooterWrapper>
  )
}
