/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { pathSatisfies } = require("ramda");

use(solidity);

// these variables globally
let signers; // this is an array of accounts
let attackers;
let purchasers = [];
let admins;
let TLKNFTStake;
let TLKNFTStakeFactory;
let owner;
let treasury;

describe("TLKNFTStake", function () {
  before(async function () {
    // get all of the signers created in hardhat.config.js
    signers = await ethers.getSigners();
    // assign the owner and admins (DEV Team)
    owner = signers[0];
    treasury = signers[888];
    admins = [signers[1], signers[2], signers[3], signers[4], signers[5]];
    attackers = [
      signers[100],
      signers[101],
      signers[102],
      signers[103],
      signers[104],
    ];

    // populate the purchasers array
    for (let i = 0; i <= 100; i++) {
      purchasers.push(signers[100 + i]);
    }

    // get the address for the TLKGenesis contract
    TheLostKingdomNFTFactory = await ethers.getContractFactory("TheLostKingdomNFT");
    // Deploy the TheLostKingdomNFT contract
    TLKGenesis = await TheLostKingdomNFTFactory.connect(owner).deploy();

    // get the address for the TLKPlayers contract
    TLKPlayersFactory = await ethers.getContractFactory("TLKPlayers");
    // Deploy the TLKPlayers contract
    TLKPlayers = await TLKPlayersFactory.connect(owner).deploy([owner.address], owner.address);

    // get the address for the TLKCoinsContract
    TLKCoinsFactory = await ethers.getContractFactory("TLKCoins");
    // Deploy the TLKCoinsContract
    TLKCoins = await TLKCoinsFactory.connect(owner).deploy("The Lost Kingdom - Token", "TLK_TOKEN");

    // Prepare the structs for deployment
    const adminAddresses = [
      admins[0].address,
      admins[1].address,
      admins[2].address,
      admins[3].address,
      admins[4].address,
    ];

    // create the contract
    TLKNFTStakeFactory = await ethers.getContractFactory("TLKNFTStake");
    // Deploy the TLKNFTStake contract
    TLKNFTStake = await TLKNFTStakeFactory.connect(owner).deploy(adminAddresses, TLKGenesis.address, TLKPlayers.address, TLKCoins.address);
  });

  describe("Minting", function () {
    it("Mint Genesis NFT", async function () {
      // Arrange
      const wallet = owner;
      let errorDetected = false;
      const target = signers[0].address;
      // Act
      //   console.log("Target Address = ", target);
      let preNFTBalance = await TLKGenesis.connect(wallet).balanceOf(target);
      preNFTBalance = preNFTBalance.toNumber();
      //   console.log("Pre Balance = ", preNFTBalance);
      await TLKGenesis.connect(wallet).mintItem(target, "https://google.com");
      let postNFTBalance = await TLKGenesis.connect(wallet).balanceOf(target);
      postNFTBalance = postNFTBalance.toNumber();
      //   console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance + 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });
  });

  describe("Staking Genesis NFTs", function () {
    it("Genesis owner should be able to stake the Genesis NFT", async function () {
      // Arrange
      const wallet = signers[0];
      //   console.log("Wallet Address = ", wallet.address);
      let errorDetected = false;
      // Act

      // Approve the transfer
      let preNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      // console.log("Pre Balance = ", preNFTBalance);

      await TLKGenesis.connect(wallet).approve(TLKNFTStake.address, 1);
      await TLKNFTStake.connect(wallet).stakeTLKGenesis(1);

      let postNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      // console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance -1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });
  });
});
