import React, { useRef, useEffect, useState } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { gsap } from 'gsap'
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
import { Howl } from 'howler'
import spirtOfGresynu from '../assets/music/spirit-of-gresynu.mp3'

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
  ${props => props.connect && css`
    @media screen and (max-width: 768px) {
      max-width: 30%;
    }
  `}
  ${props => props.left && css`
    margin-left: 2rem;
  `}
`

function NavBar() {

  const homeRef = useRef();
  const aboutRef = useRef();
  const roadmapRef = useRef();
  const teamRef = useRef();
  const faqRef = useRef();
  const loreRef = useRef();

  const twitterRef = useRef();
  const discordRef = useRef();
  const audioWaveRef = useRef();
  const connectBtnRef = useRef();

  const [currentSound, setCurrentSound] = useState()
  const [soundID, setSoundId] = useState(0)
  const [isStopped, setIsStopped] = useState(false)

  useEffect(() => {
    const refs = [
      homeRef.current,
      aboutRef.current,
      roadmapRef.current,
      teamRef.current,
      faqRef.current,
      loreRef.current
    ]
    const socialRefs = [
      twitterRef.current,
      discordRef.current,
      audioWaveRef.current,
      connectBtnRef.current
    ]
    gsap.from(refs, { y: -200, stagger: 0.3, opacity: 0 })
    gsap.from(socialRefs, { y: -200, stagger: 0.3, opacity: 0, delay: 1 })
  }, [])

  useEffect(() => {
    // edit volume so that its not to loud while playing
    const themeMusic = new Howl({ src: spirtOfGresynu, loop: true })
    setCurrentSound(themeMusic)
    const soundId = themeMusic.play()
    setSoundId(soundId)
  }, [])

  const handleMusic = () => {
    // check if the sound is playing
    if (!isStopped) {
      // if so pause sound
      setIsStopped(true);
      currentSound.fade(100, 0, 3000, soundID)
      currentSound.pause(soundID)
      // console.log({ currentSound, soundID }, currentSound.seek(soundID))
    } else {
      setIsStopped(false);
      currentSound.fade(0, 100, 600, soundID)
      currentSound.play(soundID)
      // console.log({ currentSound, soundID }, currentSound.seek(soundID))
    }
  }

  return (
    <NavWrap>
      <NavBox hide>
        <NavItem ref={homeRef} src={home} />
        <NavItem ref={aboutRef} src={about} />
        <NavItem ref={roadmapRef} src={roadmap} />
        <NavItem ref={teamRef} src={team} />
        <NavItem ref={faqRef} src={faq} />
        <NavItem ref={loreRef} src={lore} />
      </NavBox>
      <NavBox>
        <NavItem ref={twitterRef} left src={twitter} />
        <NavItem ref={discordRef} left src={discord} />
        <NavItem onClick={handleMusic} ref={audioWaveRef} left src={music} />
        <NavItem ref={connectBtnRef} connect left src={connect} />
      </NavBox>
    </NavWrap>
  )
}

export default NavBar;
