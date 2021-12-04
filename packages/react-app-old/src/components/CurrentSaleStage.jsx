import React from "react";
import styled from "styled-components";

const CountdownWrap = styled.span`
  text-align: center;
  font-size: 1.2vw;
  @media (max-width: 745px) {
    font-size: 4vw;
  }
`;

export default function CurrentSaleStage() {
  return <CountdownWrap>Sale has not started yet</CountdownWrap>;
}
