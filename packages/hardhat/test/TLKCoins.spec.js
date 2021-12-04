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
let TLKCoins;
let TLKCoinsFactory;
let owner;

describe("TLKCoins", function () {
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
    TLKCoinsFactory = await ethers.getContractFactory("TLKCoins");
    // Deploy the TLKCoins contract
    TLKCoins = await TLKCoinsFactory.connect(owner).deploy(
      "The Lost Kingdom - Token",
      "TLKT"
    );
  });

  describe("Attack Owner Functions", function () {
    it("Attacker should not be able to setAdmin", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKCoins.connect(attacker).setAdmin(attacker.address,true);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Attacker should not be able to isAdmin", async function () {
        // Arrange
        const attacker = attackers[0];
        // Act
        const tryToEdit = TLKCoins.connect(attacker).isAdmin(attacker.address);
        // Assert
        await expect(tryToEdit).to.be.revertedWith(
          "Nice try! You need to be an admin"
        );
      });

    it("Attacker should not be able to getAdminMinted", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKCoins.connect(attacker).getAdminMinted(attacker.address);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to safeTransferETH", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((1).toString());        
      // Act
      const tryToSend = TLKCoins.connect(attacker).safeTransferETH(attacker.address,value);
      // Assert
      await expect(tryToSend).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Attacker should not be able to safeTransfer", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((1).toString());        
      // Act
      const tryToSend = TLKCoins.connect(attacker).safeTransfer(TLKCoins.address, attacker.address,value);
      // Assert
      await expect(tryToSend).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Attacker should not be able to adminMint", async function () {
      // Arrange
      const wallet = attackers[0];
      const amount = ethers.utils.parseUnits((2).toString());
      // Act
      const attemptMint = TLKCoins.connect(wallet).adminMint(wallet.address, amount);
      // Assert
      await expect(attemptMint).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to adminBurn", async function () {
      // Arrange
      const wallet = attackers[0];
      const amount = ethers.utils.parseUnits((2).toString());
      // Act
      const attemptBurn = TLKCoins.connect(wallet).adminBurn(wallet.address, amount);
      // Assert
      await expect(attemptBurn).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

  });

  describe("Contract Configuration", function () {
    it("Owner should be able to setAdmin", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKCoins.connect(wallet).setAdmin(signers[6].address, true);
      // Assert
      const adminFlag = await TLKCoins.isAdmin(signers[6].address);
      // eslint-disable-next-line no-unused-expressions
      expect(adminFlag).to.be.true;
    });

    it("Admin should be able to getAdminMinted", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      let adminTokensMinted = await TLKCoins.connect(wallet).getAdminMinted(wallet.address);
      // Assert
      expect(adminTokensMinted).to.be.eq(0);
    });
  });

  describe("Owner/Admin Functions", function () {
    it("Owner should be able to safeTransferETH", async function () {
      // Arrange
      const wallet = owner;
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
      const tx = await wallet.sendTransaction({to: TLKCoins.address, value: ethers.utils.parseEther("1.0") });
      let walletBalancePost = await provider.getBalance(wallet.address);
      walletBalancePost = Number(ethers.utils.formatEther(walletBalancePost)).toFixed(3);
      // console.log("walletBalance (Post) = ", walletBalancePost);
      let delta = Number(walletBalancePost - walletBalance).toFixed(3);
      // console.log("Delta = ", delta);
      if (delta < 0) {
        sendFailure = false;
      }
      // Use the safeTransferETH method to send the 1 ETH back to the original sender
      const tryToSend = await TLKCoins.connect(wallet).safeTransferETH(wallet.address,value);
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

    it("Admin should be able to adminMint", async function () {
      // Arrange
      const wallet = signers[6];
      let amount = ethers.utils.parseUnits((2).toString());
    //   console.log("Amount = ", amount);
      let successFlag = false;
      let preSupply = await TLKCoins.connect(wallet).totalSupply();
    //   console.log("totalSupply (pre) = ", preSupply);
      // Act
      await TLKCoins.connect(wallet).adminMint(wallet.address, amount);
      // Assert
      let balance = await TLKCoins.connect(wallet).balanceOf(wallet.address);
    //   console.log("Wallet Balance = ", balance);
      // check to see if we have the correct balance of tokens in the wallet
      if (balance == "2000000000000000000") {
            let postSupply = await TLKCoins.connect(wallet).totalSupply();
            // console.log("totalSupply (post) = ", postSupply);
            let delta = postSupply - preSupply;
            // console.log("delta = ", delta);
            if (delta == ethers.utils.parseUnits((2).toString()))
            {
                successFlag = true;
            }
      }
      expect(successFlag).to.be.eq(true);
    });

    it("Owner should be able to safeTransfer tokens", async function () {
      // Arrange
      const wallet = signers[6];
      const provider = ethers.provider;
      let sendFailure = true;
      let returnFailure = true;
      let success = false;
      let amount = ethers.utils.parseUnits((1).toString());
      // console.log("Amount = ", amount);
      // Act
      let walletBalancePre = await TLKCoins.balanceOf(wallet.address);
      // console.log("Amount = ", amount);
      walletBalancePre = Number(ethers.utils.formatEther(walletBalancePre)).toFixed(3);
      // console.log("walletBalancePre = ", walletBalancePre);
      let contractBalance = await TLKCoins.balanceOf(TLKCoins.address);
      contractBalance = Number(ethers.utils.formatEther(contractBalance)).toFixed(3);
      // console.log("contractBalance = ", contractBalance);
      let tryToApprove = await TLKCoins.connect(wallet).approve(TLKCoins.address, amount);
      // console.log(tryToApprove);
      let tryToSend = await TLKCoins.connect(wallet).transfer(TLKCoins.address, amount);
      let contractBalancePost = await TLKCoins.balanceOf(TLKCoins.address);
      contractBalancePost = Number(ethers.utils.formatEther(contractBalancePost)).toFixed(3);
      // console.log("contractBalancePost = ", contractBalancePost);
      // Check to see if we were able to send the tokens into the contract
      if (contractBalancePost > contractBalance) {
        sendFailure = false;
      }
      let walletBalancePost = await TLKCoins.balanceOf(wallet.address);
      walletBalancePost = Number(ethers.utils.formatEther(walletBalancePost)).toFixed(3);
      // console.log("walletBalancePost(Post) = ", walletBalancePost);
      // Attempt to return the tokens to the original wallet
      tryToApprove = await TLKCoins.connect(owner).approve(TLKCoins.address, amount);
      // console.log(tryToApprove);
      tryToSend = await TLKCoins.connect(owner).safeTransfer(TLKCoins.address, wallet.address, amount);
      let walletBalanceReturned = await TLKCoins.balanceOf(wallet.address);
      walletBalanceReturned = Number(ethers.utils.formatEther(walletBalanceReturned)).toFixed(3);
      // console.log("walletBalanceReturned = ", walletBalanceReturned);
      let contractBalanceReturned = await TLKCoins.balanceOf(TLKCoins.address);
      contractBalanceReturned = Number(ethers.utils.formatEther(contractBalanceReturned)).toFixed(3);
      // console.log("contractBalanceReturned = ", contractBalanceReturned);
      // Check to see if the tokens were returned to the sending wallet
      if (walletBalancePre == walletBalanceReturned) {
        returnFailure = false;
      }
      // Assert
      if (sendFailure == false && returnFailure == false) {
          success = true;
      }
      expect(success).to.be.eq(true);
    });

    it("Admin should be able to adminBurn", async function () {
      // Arrange
      const wallet = signers[6];
      let amount = ethers.utils.parseUnits((2).toString());
      // console.log("Amount = ", amount);
      let successFlag = false;
      let preSupply = await TLKCoins.connect(wallet).totalSupply();
      preSupply = Number(ethers.utils.formatEther(preSupply)).toFixed(3);
      // console.log("totalSupply (pre) = ", preSupply);
      // Act
      await TLKCoins.connect(wallet).adminBurn(wallet.address, amount);
      // Assert
      let balance = await TLKCoins.connect(wallet).balanceOf(wallet.address);
      balance = Number(ethers.utils.formatEther(balance)).toFixed(3);
      // console.log("Wallet Balance = ", balance);
      // check to see if we have the correct balance of tokens in the wallet
      if (balance == "0.000") {
            let postSupply = await TLKCoins.connect(wallet).totalSupply();
            postSupply = Number(ethers.utils.formatEther(postSupply)).toFixed(3);
            // console.log("totalSupply (post) = ", postSupply);
            let delta = preSupply - amount;
            // console.log("delta = ", delta);
            if (delta == -2000000000000000000)
            {
                successFlag = true;
            }
      }
      expect(successFlag).to.be.eq(true);
    });
  });
});