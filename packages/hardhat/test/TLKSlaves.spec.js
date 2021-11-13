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
let TLKSlaves;
let TLKSlavesFactory;
let owner;
let treasury;

describe("TLKSlaves", function () {
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
    TLKSlavesFactory = await ethers.getContractFactory("TLKSlaves");
    // Prepare the structs for deployment
    const adminAddresses = [
      // claim + admin rights
      admins[0].address,
      admins[1].address,
      admins[2].address,
      admins[3].address,
      admins[4].address,
    ];
    // Deploy the TLKSlaves contract
    TLKSlaves = await TLKSlavesFactory.connect(owner).deploy(
      adminAddresses,
      treasury.address
    );
  });

  describe("Attack Owner Functions", function () {
    it("Attacker should not be able to setAdmin", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setAdmin(
        attacker.address,
        true,
        10
      );
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Attacker should not be able to setTreasury", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setTreasury(attacker.address);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Attack Admin Functions", function () {
    it("Attacker should not be able to setProvenanceHash", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit =
        TLKSlaves.connect(attacker).setProvenanceHash("HASH_STRING");
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to lockProvenance", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).lockProvenance();
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setBaseURI", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setBaseURI(
        "https://www.google.com/"
      );
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setContractURI", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setContractURI(
        "https://www.google.com/"
      );
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setSale", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setSale(true);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setMaxTLKSlaves", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setMaxTLKSlaves(20000);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setSlavePrice", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((2).toString());
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setSlavePrice(value);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setSale", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKSlaves.connect(attacker).setSale(true);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });
  });

  describe("Initial Contract Configuration", function () {
    it("Should allow admin to setSale(true)", async function () {
      // Arrange
      let isSaleLive;
      const admin = admins[0];
      // Act
      await TLKSlaves.connect(admin).setSale(true);
      // eslint-disable-next-line prefer-const
      isSaleLive = await TLKSlaves._isSaleLive();
      // Assert
      expect(isSaleLive).to.be.a("boolean");
      // eslint-disable-next-line no-unused-expressions
      expect(isSaleLive).to.be.true;
    });

    it("Should allow admin to setSale(false)", async function () {
      // Arrange
      let isSaleLive;
      const admin = admins[0];
      // Act
      await TLKSlaves.connect(admin).setSale(false);
      // eslint-disable-next-line prefer-const
      isSaleLive = await TLKSlaves._isSaleLive();
      // Assert
      expect(isSaleLive).to.be.a("boolean");
      // eslint-disable-next-line no-unused-expressions
      expect(isSaleLive).to.be.false;
    });
  });

  describe("Contract Configuration", function () {
    it("Owner should be able to set another Admin", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKSlaves.connect(wallet).setAdmin(signers[6].address, true, 10);
      // Assert
      const account = await TLKSlaves.getTLKSlaveHolder(signers[6].address);
      let adminFlag = account[2];
      // eslint-disable-next-line no-unused-expressions
      expect(adminFlag).to.be.true;
    });

    it("Admin should be able to setProvenanceHash", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKSlaves.connect(wallet).setProvenanceHash("HASH_STRING");
      // Assert
      const getHash = await TLKSlaves.PROVENANCE_HASH();
      await expect(getHash).to.be.eq("HASH_STRING");
    });

    it("Admin should be able to lockProvenance", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKSlaves.connect(wallet).lockProvenance();
      // Assert
      const getLock = await TLKSlaves.PROVENANCE_LOCK();
      await expect(getLock).to.be.true;
    });

    it("Admin should be able to setBaseURI", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      // const account = await TLKSlaves.getTLKSlaveHolder(signers[6].address);
      // console.log("Reserves: ", account[0]);
      await TLKSlaves.connect(wallet).setBaseURI("https://www.google.com/");
      await TLKSlaves.connect(wallet).adminMintIds([888]);
      // Assert
      const getBaseURI = await TLKSlaves.tokenURI(888);
      await expect(getBaseURI).to.be.eq("https://www.google.com/888");
    });

    it("Admin should be able to setContractURI", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      await TLKSlaves.connect(wallet).setContractURI("https://www.google.com/");
      // Assert
      const getContractURI = await TLKSlaves.contractURI();
      await expect(getContractURI).to.be.eq("https://www.google.com/");
    });

    it("Admin should be able to setMaxTLKSlaves", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKSlaves.connect(wallet).setMaxTLKSlaves(100000);
      // Assert
      const getMaxTLKSlaves = await TLKSlaves._maxTLKSlaves();
      await expect(getMaxTLKSlaves).to.be.eq(100000);
    });

    it("Admin should be able to setSlavePrice", async function () {
      // Arrange
      const wallet = admins[0];
      let newPrice = ethers.utils.parseUnits((0.07).toString());
      // Act
      await TLKSlaves.connect(wallet).setSlavePrice(newPrice);
      // Assert
      let getSlavePrice = await TLKSlaves._priceTLKSlaves();
      getSlavePrice = Number(ethers.utils.formatEther(getSlavePrice)).toFixed(
        3
      );
      await expect(getSlavePrice).to.be.eq("0.070");
      // return price to normal
      newPrice = ethers.utils.parseUnits((0.069).toString());
      await TLKSlaves.connect(wallet).setSlavePrice(newPrice);
    });

    it("Owner should be able to setTreasury", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKSlaves.connect(owner).setTreasury(wallet.address);
      // Assert
      let getTreasury = await TLKSlaves.connect(wallet)._treasuryAddress();
      await expect(getTreasury).to.be.eq(wallet.address);
    });
  });

  describe("Get Contract Information", function () {
    it("Public should be able to getSale", async function () {
      // Arrange
      const wallet = signers[88];
      let passedTest = false;
      // Act
      let saleValue = await TLKSlaves.connect(wallet).getSale();
      // console.log("SaleValue: ", saleValue);
      // Assert
      await expect(saleValue).to.be.false;
    });
  });

  describe("Admin Minting", function () {
    it("Admin should be able to mint DEV NFTs", async function () {
      // Arrange
      // 1 = Waldo
      // 3 = Loser.dev
      // 7 = Jack
      // 8 = Loser.root
      // 69 = LoserKing
      const adminNFTs = [1, 3, 7, 8, 69];
      let errorDetected = false;
      // Act
      // Loop through the admin accounts and mint the Admin NFT for each wallet
      for (let i = 0; i < admins.length; i++) {
        // console.log("Minting Admin #", i, " NFT#", adminNFTs[i]);
        // eslint-disable-next-line no-await-in-loop
        await TLKSlaves.connect(admins[i]).adminMintIds([adminNFTs[i]]);
        // eslint-disable-next-line no-await-in-loop
        let nftOwner = await TLKSlaves.connect(admins[i]).ownerOf([adminNFTs[i]]);
        // console.log("Owner NFT#", adminNFTs[i], " = ", nftOwner);
        if (nftOwner !== admins[i].address) {
          errorDetected = true;
        }
        // eslint-disable-next-line no-await-in-loop
        // let slaveHolder = await TLKSlaves.getTLKSlaveHolder(admins[i].address);
        // console.log("Slave Holder (", admins[i].address, "): ", slaveHolder);
      }
      // Assert
      expect(errorDetected).to.be.eq(false);
    });

    it("Admin should be able to mint reserved NFTs", async function () {
      // Arrange
      const reservedIDs = [
        0, 13, 23, 33, 42, 187, 233, 300, 322, 365, 369, 411, 420, 480, 555,
        618, 666, 720, 911, 1080, 1138, 1337, 1776, 2020, 2160, 9000,
      ];
      const purchaser = treasury;
      let preSupply = await TLKSlaves.connect(purchaser).totalSupply();
      let numReserved = reservedIDs.length;
      // console.log("numReserved: ", numReserved);
      // console.log("PreSupply: ", preSupply);
      // Act
      await TLKSlaves.connect(purchaser).adminMintIds(reservedIDs);
      let postSupply = await TLKSlaves.connect(purchaser).totalSupply();
      let delta = postSupply - preSupply;
      // Assert
      // console.log("PostSupply: ", postSupply);
      // console.log("delta: ", delta);
      await expect(delta).to.be.eq(numReserved);
    });
  });

  describe("Minting", function () {
    before(async function () {
      const admin = admins[0];
      await TLKSlaves.connect(admin).setSale(true);
    });

    afterEach(async function () {
      const admin = admins[0];
      await TLKSlaves.connect(admin).setSale(true);
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const timestamp = block.timestamp;
    });

    it("Should not be able to mint before sale is active", async function () {
      // Arrange
      const admin = admins[0];
      await TLKSlaves.connect(admin).setSale(false);
      const buyAmount = 5;
      const purchaser = purchasers[0];
      const value = ethers.utils.parseUnits((0.069 * buyAmount).toString());
      // Act
      const res = TLKSlaves.connect(purchaser).mintSlave(buyAmount, { value });
      // Assert
      await expect(res).to.be.revertedWith("Sale must be active'");
    });

    it("Contract address balance should increase correctly on a mint event", async function () {
      // Arrange
      const admin = admins[0];
      let blockNum = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNum);
      let timestamp = block.timestamp;
      // let provider = ethers.getDefaultProvider();
      let preBalance = await ethers.provider.getBalance(TLKSlaves.address);
      preBalance = Number(ethers.utils.formatEther(preBalance)).toFixed(3);
      // console.log("TLKSlaves Balance (pre): ", preBalance);
      // Calculate purchase price
      const value = ethers.utils.parseUnits((0.069 * 5).toString());
      // Act
      await TLKSlaves.connect(purchasers[0]).mintSlave(5, { value });
      // Check updated balance
      let postBalance = await ethers.provider.getBalance(TLKSlaves.address);
      postBalance = Number(ethers.utils.formatEther(postBalance)).toFixed(3);
      // console.log("TLKSlaves Balance (post): ", postBalance);
      let targetBalance = Number(Number(preBalance) + 0.069 * 5).toFixed(3);
      // console.log("Target Value: ", targetBalance);
      // Assert
      expect(postBalance).to.be.eq(targetBalance);
    });

    it("Purchase 500 NFTs from 100 purchaser wallets", async function () {
      // Arrange
      const purchaser = admins[0];
      const value = ethers.utils.parseUnits((0.069 * 5).toString());
      let preSupply = await TLKSlaves.connect(purchaser).totalSupply();
      // console.log("PreSupply: ", preSupply);
      // Act
      // Loop through and buy the MAX NFTs from each purchaser wallet
      for (let i = 0; i < 100; i++) {
        // eslint-disable-next-line no-await-in-loop
        // console.log("Minting 5 NFTs for Address: ", purchasers[i].address);
        // eslint-disable-next-line no-await-in-loop
        await TLKSlaves.connect(purchasers[i]).mintSlave(5, { value });
      }
      let postSupply = await TLKSlaves.connect(purchaser).totalSupply();
      let delta = postSupply - preSupply;
      // Assert
      // console.log("PostSupply: ", postSupply);
      // console.log("delta: ", delta);
      await expect(delta).to.be.eq(500);
    });
  });

  describe("Transfer to Treasury", function () {
    it("Admin should be able to transfer funds to the treasury", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      const provider = ethers.provider;
      let contractBalance = await provider.getBalance(TLKSlaves.address);
      contractBalance = Number(
        ethers.utils.formatEther(contractBalance)
      ).toFixed(3);
      // console.log("contractBalance = ", contractBalance);
      let treasuryAddress = await TLKSlaves._treasuryAddress();
      let treasuryBalance = await provider.getBalance(treasuryAddress);
      treasuryBalance = Number(
        ethers.utils.formatEther(treasuryBalance)
      ).toFixed(3);
      // console.log("treasuryBalance = ", treasuryBalance);
      await TLKSlaves.connect(wallet).depositTreasury();
      let treasuryBalancePost = await provider.getBalance(treasuryAddress);
      treasuryBalancePost = Number(
        ethers.utils.formatEther(treasuryBalancePost)
      ).toFixed(3);
      // console.log("treasuryBalance (Post) = ", treasuryBalancePost);
      // let delta = Number(treasuryBalancePost - treasuryBalance).toFixed(3);
      // console.log("Delta = ", delta);
      // Assert
      let target = Number(
        Number(contractBalance) + Number(treasuryBalance)
      ).toFixed(3);
      expect(treasuryBalancePost).to.be.eq(target);
    });
  });
});
