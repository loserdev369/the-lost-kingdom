import React from "react";
import styled from "styled-components";
import Address from "./Address";
import Wallet from "./Wallet";

const ButtonWrap = styled.button`
  background: #03BAAD;
  color: black;
  padding: 1rem 2rem;
  font-size: 1rem;
  text-transform: uppercase !important;
  cursor: pointer !important;
  border: 0;
  display: inline-block;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  @media(max-width: 765px){
    margin-left: 0;
  }
`
export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <ButtonWrap
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          Logout
        </ButtonWrap>,
      );
    } else {
      modalButtons.push(
        <ButtonWrap
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={loadWeb3Modal}
        >
          Connect
        </ButtonWrap>,
      );
    }
  }

  const display = minimized ? (
    ""
  ) : (
    <span>
      {address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />}
      <Wallet
        address={address}
        provider={localProvider}
        signer={userSigner}
        ensProvider={mainnetProvider}
        price={price}
      />
    </span>
  );

  return (
    <Wrap>
      <span>{display}</span>
      <span>{modalButtons}</span>
    </Wrap>
  );
}
