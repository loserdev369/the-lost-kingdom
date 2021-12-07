import styled from '@emotion/styled'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

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
  const t1 = useRef()

  const titleRef = useRef();
  const m1AvatarRef = useRef()
  const m1NameRef = useRef()
  const m1TitleRef = useRef()
  const m2AvatarRef = useRef()
  const m2NameRef = useRef()
  const m2TitleRef = useRef()
  const m3AvatarRef = useRef()
  const m3NameRef = useRef()
  const m3TitleRef = useRef()
  const m4AvatarRef = useRef()
  const m4NameRef = useRef()
  const m4TitleRef = useRef()

  useLayoutEffect(() => {

    const refs = [
      titleRef.current,
      m1AvatarRef.current,
      m1NameRef.current,
      m1TitleRef.current,
      m2AvatarRef.current,
      m2NameRef.current,
      m2TitleRef.current,
      m3AvatarRef.current,
      m3NameRef.current,
      m3TitleRef.current,
      m4AvatarRef.current,
      m4NameRef.current,
      m4TitleRef.current
    ]

    t1.current = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        markers: true,
        toggleActions: 'play none none none',
        start: 'top center',
        ease: 'power1.inOut',
      }
    })
      .from(refs, { y: -90, opacity: 0, stagger: 0.1 })
    // .from(roadMap1Refs, { x: 300, opacity: 0, stagger: 0.4 })
  }, [])


  return (
    <SectionWrap>
      <Heading ref={titleRef} src={team} />
      <MemberWrap>
        <Member>
          <Avatar ref={m1AvatarRef} src={loserKingAvatar} />
          <Name ref={m1NameRef} src={loserKing} />
          <Title ref={m1TitleRef} src={loserKingTitle} />
        </Member>
        <Member>
          <Avatar ref={m2AvatarRef} src={loserDevAvatar} />
          <Name ref={m2NameRef} src={loserDev} />
          <Title ref={m2TitleRef} src={loserDevTitle} />
        </Member>
        <Member>
          <Avatar ref={m3AvatarRef} src={loserRootAvatar} />
          <Name ref={m3NameRef} src={loserRoot} />
          <Title ref={m3TitleRef} src={loserRootTitle} />
        </Member>
        <Member>
          <Avatar ref={m4AvatarRef} src={waldoAvatar} />
          <Name ref={m4NameRef} src={waldo} />
          <Title ref={m4TitleRef} src={waldoTitle} />
        </Member>
      </MemberWrap>
    </SectionWrap>
  )
}
