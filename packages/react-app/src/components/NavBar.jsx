import React from "react"
import styled from "@emotion/styled"
import home from '../assets/pages/hero/nav/home.png'
import about from '../assets/pages/hero/nav/about.png'
import roadmap from '../assets/pages/hero/nav/roadmap.png'
import team from '../assets/pages/hero/nav/team.png'
import faq from '../assets/pages/hero/nav/faq.png'
import lore from '../assets/pages/hero/nav/lore.png'

const NavWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
`

const NavBox = styled.div`
  background: red;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const NavItem = styled.img`
  display: block;
`

function NavBar() {
  return (
    <NavWrap>
      <NavBox>
        <NavItem src={home} />
        <NavItem src={about} />
        <NavItem src={roadmap} />
        <NavItem src={team} />
        <NavItem src={faq} />
        <NavItem src={lore} />
      </NavBox>
      <NavBox>Nav Items</NavBox>
    </NavWrap>
  )
}

export default NavBar;
