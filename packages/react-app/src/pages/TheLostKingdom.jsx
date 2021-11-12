import React, { useCallback, useEffect, useState } from "react";
import styled from 'styled-components'
import Account from "../components/Account"

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

export default function TheLostKingdom(
  {
    address,
    localProvider,
    userSigner,
    mainnetProvider,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    blockExplorer,
  }
) {
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
          <Account
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </SocialWrap>
      </NavGrid>
      <h1>The Lost Kingdom</h1>
    </>
  )
}



