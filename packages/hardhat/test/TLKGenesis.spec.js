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
let TheLostKingdomNFT;
let TheLostKingdomNFTFactory;
let owner;
let treasury;

describe("TLKGenesis", function () {
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

    // create the contract
    TheLostKingdomNFTFactory = await ethers.getContractFactory("TheLostKingdomNFT");
    // Deploy the TheLostKingdomNFT contract
    TheLostKingdomNFT = await TheLostKingdomNFTFactory.connect(owner).deploy();
  });

  describe("Admin Minting", function () {
    it("Admin should be able to mint NFTs", async function () {
      // Arrange
      const wallet = owner;
      let errorDetected = false;
      const target = signers[0].address;
      // Act
    //   console.log("Target Address = ", target);
      let preNFTBalance = await TheLostKingdomNFT.connect(wallet).balanceOf(target);
      preNFTBalance = preNFTBalance.toNumber();
    //   console.log("Pre Balance = ", preNFTBalance);
      await TheLostKingdomNFT.connect(wallet).mintItem(target, "https://google.com");
      let postNFTBalance = await TheLostKingdomNFT.connect(wallet).balanceOf(target);
      postNFTBalance = postNFTBalance.toNumber();
    //   console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance + 1) ) {
          errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });
  });
});
