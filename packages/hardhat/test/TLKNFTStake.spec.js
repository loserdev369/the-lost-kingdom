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

    // Make sure the TLK Staking contract is an Admin of the TLK Coins contract
    await TLKCoins.connect(owner).setAdmin(TLKNFTStake.address, true);
  });

  describe("Attack Owner/Admin Functions", function () {
    it("Attacker should not be able to setAdmin", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tx = TLKNFTStake.connect(attacker).setAdmin(attacker.address,true);
      // Assert
      await expect(tx).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Attacker should not be able to isAdmin", async function () {
        // Arrange
        const attacker = attackers[0];
        // Act
        const tx = TLKNFTStake.connect(attacker).isAdmin(attacker.address);
        // Assert
        await expect(tx).to.be.revertedWith(
          "Nice try! You need to be an admin"
        );
      });

    it("Attacker should not be able to safeTransferETH", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((1).toString());        
      // Act
      const tx = TLKNFTStake.connect(attacker).safeTransferETH(attacker.address,value);
      // Assert
      await expect(tx).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to safeTransfer", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((1).toString());        
      // Act
      const tx = TLKNFTStake.connect(attacker).safeTransfer(TLKCoins.address, attacker.address,value);
      // Assert
      await expect(tx).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setEarnRates", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tx = TLKNFTStake.connect(attacker).setEarnRates(1,1);
      // Assert
      await expect(tx).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });
  });

  describe("Admin Functions", function () {
    it("Owner should be able to setAdmin", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKNFTStake.connect(wallet).setAdmin(signers[6].address, true);
      // Assert
      const adminFlag = await TLKNFTStake.isAdmin(signers[6].address);
      // eslint-disable-next-line no-unused-expressions
      expect(adminFlag).to.be.true;
    });

    it("Admin should be able to safeTransferETH", async function () {
      // Arrange
      const wallet = signers[6];
      const value = ethers.utils.parseUnits((1).toString());
      const provider = ethers.provider;
      let sendFailure = true;
      let returnFailure = true;
      let success = false;
      // Act
      let walletBalance = await provider.getBalance(wallet.address);
      walletBalance = Number(ethers.utils.formatEther(walletBalance)).toFixed(3);
      // console.log("walletBalance = ", walletBalance);
      // Send 1 ETH over to the contract address
      const tx = await wallet.sendTransaction({to: TLKNFTStake.address, value: ethers.utils.parseEther("1.0") });
      let walletBalancePost = await provider.getBalance(wallet.address);
      walletBalancePost = Number(ethers.utils.formatEther(walletBalancePost)).toFixed(3);
      // console.log("walletBalance (Post) = ", walletBalancePost);
      let delta = Number(walletBalancePost - walletBalance).toFixed(3);
      // console.log("Delta = ", delta);
      if (delta < 0) {
        sendFailure = false;
      }
      // Use the safeTransferETH method to send the 1 ETH back to the original sender
      const tryToSend = await TLKNFTStake.connect(wallet).safeTransferETH(wallet.address,value);
      // Check the balance to see if we're back to the original value
      let walletBalanceReturn = await provider.getBalance(wallet.address);
      walletBalanceReturn = Number(ethers.utils.formatEther(walletBalanceReturn)).toFixed(3);
      // console.log("walletBalance (Return) = ", walletBalanceReturn);
      delta = Number(walletBalance - walletBalanceReturn).toFixed(3);
      // console.log("Delta = ", delta);
      if (delta < 1) {
        returnFailure = false;
      }
      // Assert
      // console.log("sendFailure = ", sendFailure);
      // console.log("returnFailure = ", returnFailure);
      if (sendFailure == false && returnFailure == false)
        success = true;
      await expect(success).to.eq(true);
    });

    it("Admin should be able to safeTransfer tokens", async function () {
      // Arrange
      const wallet = signers[6];
      const provider = ethers.provider;
      let mintFailure = true;
      let sendFailure = true;
      let success = false;
      let amount = ethers.utils.parseUnits((1).toString());
      // console.log("Amount = ", amount);

      let walletBalancePre = await TLKCoins.balanceOf(wallet.address);
      walletBalancePre = Number(ethers.utils.formatEther(walletBalancePre)).toFixed(3);
      // console.log("walletBalancePre = ", walletBalancePre);

      // Act
      let contractBalancePre = await TLKCoins.balanceOf(TLKNFTStake.address);
      contractBalancePre = Number(ethers.utils.formatEther(contractBalancePre)).toFixed(3);
      // console.log("contractBalancePre = ", contractBalancePre);

      // Send TLKTokens into the TLKStaking wallet
      await TLKCoins.connect(owner).adminMint(TLKNFTStake.address, amount);

      let contractBalancePost = await TLKCoins.balanceOf(TLKNFTStake.address);
      contractBalancePost = Number(ethers.utils.formatEther(contractBalancePost)).toFixed(3);
      // console.log("contractBalancePost = ", contractBalancePost);

      // Check to see if we were able to send the tokens into the contract
      if (contractBalancePost > contractBalancePre) {
        mintFailure = false;
      }

      // Attempt to send the tokens from the contract to a target wallet
      let tryToApprove = await TLKCoins.connect(wallet).approve(TLKNFTStake.address, amount);
      // console.log(tryToApprove);
      tryToSend = await TLKNFTStake.connect(owner).safeTransfer(TLKCoins.address, wallet.address, amount);

      let walletBalancePost = await TLKCoins.balanceOf(wallet.address);
      walletBalancePost = Number(ethers.utils.formatEther(walletBalancePost)).toFixed(3);
      // console.log("walletBalancePost = ", walletBalancePost);

      let contractBalanceReturned = await TLKCoins.balanceOf(TLKNFTStake.address);
      contractBalanceReturned = Number(ethers.utils.formatEther(contractBalanceReturned)).toFixed(3);
      // console.log("contractBalanceReturned = ", contractBalanceReturned);

      // Check to see if the tokens were sent to the sending wallet
      if (walletBalancePre < walletBalancePost) {
        sendFailure = false;
      }
      // Assert
      if (sendFailure == false && sendFailure == false) {
          success = true;
      }
      expect(success).to.be.eq(true);
    });

    it("Admin should be able to setEarnRates", async function () {
      // Arrange
      const wallet = signers[6];
      let failure = true;
      let genesisDailyRate = await TLKNFTStake.connect(wallet).GENESIS_DAILY_RATE();
      // genesisDailyRate = String(genesisDailyRate);
      // console.log("Genesis Daily Rate = ", genesisDailyRate);
      let playersDailyRate = await TLKNFTStake.connect(wallet).PLAYERS_DAILY_RATE();
      // playersDailyRate = String(playersDailyRate);
      // console.log("Players Daily Rate = ", playersDailyRate);
      // Act
      await TLKNFTStake.connect(wallet).setEarnRates(100000,200000);
      // Assert
      genesisDailyRate = await TLKNFTStake.connect(wallet).GENESIS_DAILY_RATE();
      genesisDailyRate = Number(ethers.utils.formatUnits(genesisDailyRate,0));
      // console.log("Genesis Daily Rate (Post) = ", genesisDailyRate);
      playersDailyRate = await TLKNFTStake.connect(wallet).PLAYERS_DAILY_RATE();
      playersDailyRate = Number(ethers.utils.formatUnits(playersDailyRate,0));
      // console.log("Players Daily Rate (Post) = ", playersDailyRate);
      if (genesisDailyRate == 100000 && playersDailyRate == 200000)
        failure = false;

      // Reset earn rates to the default values
      await TLKNFTStake.connect(wallet).setEarnRates(500000,100000);
        // eslint-disable-next-line no-unused-expressions
      expect(failure).to.be.false;
    });
  });

  describe("Minting & Staking NFTs", function () {
    it("Mint TLKGenesis NFT", async function () {
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

    it("Mint TLKPlayer NFT", async function () {
      // Arrange
      const wallet = owner;
      const adminNFTs = [88];
      let errorDetected = false;
      // Act
      //   console.log("Target Address = ", target);
      let preNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      //   console.log("Pre Balance = ", preNFTBalance);
      await TLKPlayers.connect(wallet).adminMintIds([adminNFTs]);
      let postNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      //   console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance + 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });

    it("TLKGenesis owner should be able to stake the NFT", async function () {
      // Arrange
      const wallet = signers[0];
      //   console.log("Wallet Address = ", wallet.address);
      let errorDetected = false;
      // Act
      let preNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      // console.log("Pre Balance = ", preNFTBalance);
      // Approve the transfer
      await TLKGenesis.connect(wallet).approve(TLKNFTStake.address, 1);
      await TLKNFTStake.connect(wallet).stakeTLKGenesis(1);
      let postNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      // console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance - 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });

    it("TLKPlayer owner should be able to stake the NFT", async function () {
      // Arrange
      const wallet = owner;
      //   console.log("Wallet Address = ", wallet.address);
      let errorDetected = false;
      // Act
      let preNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      // console.log("Pre Balance = ", preNFTBalance);
      // Approve the transfer
      await TLKPlayers.connect(wallet).approve(TLKNFTStake.address, 88);
      await TLKNFTStake.connect(wallet).stakeTLKPlayer(88);
      let postNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      // console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance - 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });

    it("Wallet with staked NFTs should be able to call totalClaimable", async function () {
      // Arrange
      const wallet = owner;
      // Act
      let claimableAmount = await TLKNFTStake.connect(wallet).totalClaimable(wallet.address);
      claimableAmount = Number(claimableAmount) / 100000;
      // console.log("Claimable Amount = ", claimableAmount);
      // Assert
      // only 2 seconds have passed since the NFTs were staked so we should have 0.00011 tokens claimable across 1 Genesis and 1 Player NFT.
      expect(claimableAmount).to.be.least(0.00011);
    });

    it("Wallet with staked NFTs should be able to call claimAll", async function () {
      // Arrange
      const wallet = owner;
      // get the token balance before the test
      let walletBalancePre = await TLKCoins.balanceOf(wallet.address);
      walletBalancePre = Number(Number(ethers.utils.formatUnits(walletBalancePre,5)).toFixed(5));
      // console.log("walletBalancePre = ", walletBalancePre);
      let claimableAmount = await TLKNFTStake.connect(wallet).totalClaimable(wallet.address);
      claimableAmount = Number(Number(ethers.utils.formatUnits(claimableAmount,5)).toFixed(5));
      // console.log("Claimable Amount = ", claimableAmount);
      // Act
      await TLKNFTStake.connect(wallet).claimAll();
      // Assert
      // get the token balance after the test
      let walletBalancePost = await TLKCoins.balanceOf(wallet.address);
      walletBalancePost = Number(Number(ethers.utils.formatUnits(walletBalancePost,5)).toFixed(5));
      // console.log("walletBalancePost = ", walletBalancePost);
      expect(walletBalancePost).to.be.least(claimableAmount);
    });

    it("Wallet with staked NFTs should be able to make additional calls to claimAll (10)", async function () {
      // Arrange
      const wallet = owner;
      const numCalls = 10;
      // get the token balance before the test
      let walletBalancePre = await TLKCoins.balanceOf(wallet.address);
      walletBalancePre = Number(Number(ethers.utils.formatUnits(walletBalancePre,5)).toFixed(5));
      // console.log("walletBalancePre = ", walletBalancePre);
      // let claimableAmount = await TLKNFTStake.connect(wallet).totalClaimable(wallet.address);

      let genesisDailyRate = await TLKNFTStake.connect(wallet).GENESIS_DAILY_RATE();
      genesisDailyRate = Number(ethers.utils.formatUnits(genesisDailyRate,0));
      // console.log("Genesis Daily Rate = ", genesisDailyRate);
      let playersDailyRate = await TLKNFTStake.connect(wallet).PLAYERS_DAILY_RATE();
      playersDailyRate = Number(ethers.utils.formatUnits(playersDailyRate,0));
      // console.log("Players Daily Rate = ", playersDailyRate);
      let claimableAmount = genesisDailyRate + playersDailyRate;
      claimableAmount = parseInt(claimableAmount / 86400) / 10000;
      // console.log("Claimable Amount = ", claimableAmount);
      // Act
      // Loop a number of times calling claimAll
      for (let i = 0; i < numCalls; i++) {
        await TLKNFTStake.connect(wallet).claimAll();
      }
      // Assert
      // get the token balance after the test
      let walletBalancePost = await TLKCoins.balanceOf(wallet.address);
      walletBalancePost = Number(Number(ethers.utils.formatUnits(walletBalancePost,5)).toFixed(5));
      // console.log("walletBalancePost = ", walletBalancePost);
      let targetValue = walletBalancePre + claimableAmount;
      // console.log("targetValue = ", targetValue);
      expect(walletBalancePost).to.be.least(targetValue);
    });

    it("TLKGenesis owner should be able to un-stake the NFT", async function () {
      // Arrange
      const wallet = signers[0];
      // console.log("Wallet Address = ", wallet.address);
      let errorDetected = false;
      // Act
      let preNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      // console.log("Pre Balance = ", preNFTBalance);
      await TLKNFTStake.connect(wallet).unStakeTLKGenesis(1);
      let postNFTBalance = await TLKGenesis.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      // console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance + 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });

    it("TLKPlayer owner should be able to un-stake the NFT", async function () {
      // Arrange
      const wallet = owner;
      // console.log("Wallet Address = ", wallet.address);
      let errorDetected = false;
      // Act
      let preNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      preNFTBalance = preNFTBalance.toNumber();
      // console.log("Pre Balance = ", preNFTBalance);
      await TLKNFTStake.connect(wallet).unStakeTLKPlayer(88);
      let postNFTBalance = await TLKPlayers.connect(wallet).balanceOf(wallet.address);
      postNFTBalance = postNFTBalance.toNumber();
      // console.log("Post Balance = ", postNFTBalance);
      if (postNFTBalance != (preNFTBalance + 1)) {
        errorDetected = true;
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });
  });
});