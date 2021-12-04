import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import home from '../assets/pages/hero/nav/home.png'
import about from '../assets/pages/hero/nav/about.png'
import roadmap from '../assets/pages/hero/nav/roadmap.png'
import team from '../assets/pages/hero/nav/team.png'
import faq from '../assets/pages/hero/nav/faq.png'
import lore from '../assets/pages/hero/nav/lore.png'
import twitter from '../assets/pages/hero/nav/twitter-icon.png'
import discord from '../assets/pages/hero/nav/discord-icon.png'
import music from '../assets/pages/hero/nav/music-icon.png'
import connect from '../assets/pages/hero/nav/connect-btn.png'

const NavWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  @media screen and (max-width: 1440px) {
    flex-direction: column;
  }
`

const NavBox = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  ${props => props.hide && css`
    @media screen and (max-width: 768px) {
      display: none; 
    }
  `}
`

const NavItem = styled.img`
  display: block;
  cursor: pointer;
  @media screen and (max-width: 1440px) {
    max-width: 20%;
  }
  ${props => props.left && css`
    margin-left: 2rem;
  `}
`

function NavBar() {
  return (
    <NavWrap>
      <NavBox hide>
        <NavItem src={home} />
        <NavItem src={about} />
        <NavItem src={roadmap} />
        <NavItem src={team} />
        <NavItem src={faq} />
        <NavItem src={lore} />
      </NavBox>
      <NavBox>
        <NavItem left src={twitter} />
        <NavItem left src={discord} />
        <NavItem left src={music} />
        <NavItem left src={connect} />
      </NavBox>
    </NavWrap>
  )
}

export default NavBar;
