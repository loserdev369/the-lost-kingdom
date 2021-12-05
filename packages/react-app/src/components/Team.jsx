import React from 'react'
import styled from '@emotion/styled'

import team from '../assets/pages/team/team-heading.png'

import loserKingAvatar from '../assets/pages/team/loser-king-avatar.png'
import loserDevAvatar from '../assets/pages/team/loser-dev-avatar.png'
import loserRootAvatar from '../assets/pages/team/loser-root-avatar.png'
import waldoAvatar from '../assets/pages/team/waldo-avatar.png'

import loserKing from '../assets/pages/team/loser-king.png'
import loserDev from '../assets/pages/team/loser-dev.png'
import loserRoot from '../assets/pages/team/loser-root.png'
import waldo from '../assets/pages/team/waldo.png'

import loserKingTitle from '../assets/pages/team/loser-king-title.png'
import loserDevTitle from '../assets/pages/team/loser-dev-title.png'
import loserRootTitle from '../assets/pages/team/loser-root-title.png'
import waldoTitle from '../assets/pages/team/waldo-title.png'

const Avatar = styled.img`
  @media (max-width: 768px) {
    width: 50vw;
  }
`

const Heading = styled.img`
  margin-top: 6vw;
  @media (max-width: 768px) {
    width: 40vw;
  }
`

const Name = styled.img`
  margin-top: 2vw;
  @media (max-width: 768px) {
    width: 30vw;
  }
`

const Title = styled.img`
  margin-top: 2vw;
  @media (max-width: 768px) {
    width: 40vw;
  }
`

const MemberWrap = styled.div`
  margin-top: 6vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const Member = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 6vw;
  }
`

const SectionWrap = styled.div``

export default function Team() {
  return (
    <SectionWrap>
      <Heading src={team} />
      <MemberWrap>
        <Member>
          <Avatar src={loserKingAvatar} />
          <Name src={loserKing} />
          <Title src={loserKingTitle} />
        </Member>
        <Member>
          <Avatar src={loserDevAvatar} />
          <Name src={loserDev} />
          <Title src={loserDevTitle} />
        </Member>
        <Member>
          <Avatar src={loserRootAvatar} />
          <Name src={loserRoot} />
          <Title src={loserRootTitle} />
        </Member>
        <Member>
          <Avatar src={waldoAvatar} />
          <Name src={waldo} />
          <Title src={waldoTitle} />
        </Member>
      </MemberWrap>
    </SectionWrap>
  )
}
