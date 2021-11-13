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
    // Prepare the structs for deployment
    const adminAddresses = [
      // claim + admin rights
      admins[0].address,
      admins[1].address,
      admins[2].address,
      admins[3].address,
      admins[4].address,
    ];
    // Deploy the TLKCoins contract
    TLKCoins = await TLKCoinsFactory.connect(owner).deploy(
      "The Lost Kingtdom - Gold Coin",
      "TLKGOLD"
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

    it("Attacker should not be able to call isAdmin", async function () {
        // Arrange
        const attacker = attackers[0];
        // Act
        const tryToEdit = TLKCoins.connect(attacker).isAdmin(attacker.address);
        // Assert
        await expect(tryToEdit).to.be.revertedWith(
          "Nice try! You need to be an admin"
        );
      });

      it("Attacker should not be able to call getAdminMinted", async function () {
        // Arrange
        const attacker = attackers[0];
        // Act
        const tryToEdit = TLKCoins.connect(attacker).getAdminMinted(attacker.address);
        // Assert
        await expect(tryToEdit).to.be.revertedWith(
          "Nice try! You need to be an admin"
        );
      });
  });

  describe("Contract Configuration", function () {
    it("Owner should be able to set another Admin", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKCoins.connect(wallet).setAdmin(signers[6].address, true);
      // Assert
      const adminFlag = await TLKCoins.isAdmin(signers[6].address);
      // eslint-disable-next-line no-unused-expressions
      expect(adminFlag).to.be.true;
    });

    it("Admin should be able to call getAdminMinted", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      let adminTokensMinted = await TLKCoins.connect(wallet).getAdminMinted(wallet.address);
      // Assert
      expect(adminTokensMinted).to.be.eq(0);
    });
  });

  describe("Admin Minting", function () {
    it("Admin should be able to mint tokens", async function () {
      // Arrange
      const wallet = signers[6];
      let amount = ethers.utils.parseUnits((2).toString());
    //   console.log("Amount = ", amount);
      let successFlag = false;
      let preSupply = await TLKCoins.connect(wallet).totalSupply();
    //   console.log("totalSupply (pre) = ", preSupply);
      // Act
      let adminTokensMinted = await TLKCoins.connect(wallet).adminMint(wallet.address, amount);
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
  });
});
