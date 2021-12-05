import React, { useState } from "react";
import Countdown from "react-countdown";
import styled from "styled-components";
import { useContractLoader, useOnBlock, usePoller } from "../hooks";

const CountDownSpan = styled(Countdown)`
  display: inline-block;
  font-size: 1.5vw !important;
  margin-left: 1rem;
`

const CountdownWrap = styled.div`
  text-align: center;
  font-size: 1.5vw;
  color: white;
  @media (max-width: 745px){
    font-size: 4vw;
  }
`;

const RenderWrap = styled.span`
  color: #03BAAD;
  font-size: 1.5vw;
  margin-left: 1rem;
`

const FontWrap = styled.div`
  font-size: 1.5vw;
`

export default function CountDownTimer({ localProvider }) {

  const [countdownTimes, setCountdownTimes] = useState([]);
  const readContracts = useContractLoader(localProvider);
  const [currentTime, setCurrentTime] = useState();

  usePoller(() => {
    setCurrentTime(Math.floor(Date.now() / 1000));
  }, 1000);

  useOnBlock(localProvider, async () => {
    if(readContracts?.DesperateApeWives) {
      const bnSaleTimes = await readContracts.DesperateApeWives.getSaleTimes();
      const saleTimes = bnSaleTimes.map(time => time.toNumber());
      setCountdownTimes(saleTimes);
      setCurrentTime(Math.floor(Date.now() / 1000));
      console.log({ saleTimes });
    }
    return true;
  });

  const padNumber = num => {
    if (num < 10) return `0${num}`;
    return num;
  };

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <RenderWrap>
        {padNumber(hours)}:{padNumber(minutes)}:{padNumber(seconds)}
      </RenderWrap>
    );
  };

  function renderCountdown() {
    if (currentTime > countdownTimes[2]) return false;
    if (currentTime > countdownTimes[1]) {
      console.log(countdownTimes[2]);
      return (
        <FontWrap>
          <span>Public Sale Begins in:</span>
          <CountDownSpan date={new Date(countdownTimes[2] * 1000)} renderer={renderer} />
        </FontWrap>
      );
    }
    if (currentTime > countdownTimes[0]) {
      console.log(countdownTimes[1]);
      return (
        <FontWrap>
          <span>Presale Ends At:</span>
          <CountDownSpan date={new Date(countdownTimes[1] * 1000)} renderer={renderer} />
        </FontWrap>
      );
    }
    if (countdownTimes.length > 0) {
      console.log({ countdownTimes });
      return (
        <FontWrap>
          <span>Presale Begins in:</span>
          <CountDownSpan date={new Date(countdownTimes[0] * 1000)} renderer={renderer} />
        </FontWrap>
      );
    }
  }

  return <CountdownWrap>{renderCountdown()}</CountdownWrap>;
}
