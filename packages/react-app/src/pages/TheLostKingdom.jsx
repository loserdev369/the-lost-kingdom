import React, { useCallback, useEffect, useState } from "react";
import styled from 'styled-components'

const NavLink = styled.a`
  margin-right: 1rem;
`

const NavGrid = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const NavWrap = styled.div``

const SocialWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

export default function TheLostKingdom() {
  return (
    <>
      <NavGrid>
        <NavWrap>
          <NavLink>
            Home
          </NavLink>
          <NavLink>
            Library
          </NavLink>
          <NavLink>
            Roadmap
          </NavLink>
          <NavLink>
            Updates
          </NavLink>
          <NavLink>
            Collections
          </NavLink>
        </NavWrap>
        <SocialWrap>
          <div>
            Twitter
          </div>
          <div>
            Discord
          </div>
          <div>
            Connect
          </div>
        </SocialWrap>
      </NavGrid>
      <h1>The Lost Kingdom</h1>
    </>
  )
}



