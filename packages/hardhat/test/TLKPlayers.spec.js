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
let TLKPlayers;
let TLKPlayersFactory;
let owner;
let treasury;

describe("TLKPlayers", function () {
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
    TLKPlayersFactory = await ethers.getContractFactory("TLKPlayers");
    // Prepare the structs for deployment
    const adminAddresses = [
      // claim + admin rights
      admins[0].address,
      admins[1].address,
      admins[2].address,
      admins[3].address,
      admins[4].address,
    ];
    // Deploy the TLKPlayers contract
    TLKPlayers = await TLKPlayersFactory.connect(owner).deploy(
      adminAddresses,
      treasury.address
    );
  });

  describe("Attack Owner Functions", function () {
    it("Attacker should not be able to setAdmin", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setAdmin(
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
      const tryToEdit = TLKPlayers.connect(attacker).setTreasury(attacker.address);
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
        TLKPlayers.connect(attacker).setProvenanceHash("HASH_STRING");
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to lockProvenance", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).lockProvenance();
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setBaseURI", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setBaseURI(
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
      const tryToEdit = TLKPlayers.connect(attacker).setContractURI(
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
      const tryToEdit = TLKPlayers.connect(attacker).setSale(true);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setMaxTLKPlayers", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setMaxTLKPlayers(20000);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setPlayerPrice", async function () {
      // Arrange
      const attacker = attackers[0];
      const value = ethers.utils.parseUnits((2).toString());
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setPlayerPrice(value);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setSale", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setSale(true);
      // Assert
      await expect(tryToEdit).to.be.revertedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("Attacker should not be able to setRoyalty", async function () {
      // Arrange
      const attacker = attackers[0];
      // Act
      const tryToEdit = TLKPlayers.connect(attacker).setRoyalty(750);
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
      await TLKPlayers.connect(admin).setSale(true);
      // eslint-disable-next-line prefer-const
      isSaleLive = await TLKPlayers._isSaleLive();
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
      await TLKPlayers.connect(admin).setSale(false);
      // eslint-disable-next-line prefer-const
      isSaleLive = await TLKPlayers._isSaleLive();
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
      await TLKPlayers.connect(wallet).setAdmin(signers[6].address, true, 10);
      // Assert
      const account = await TLKPlayers.getTLKPlayerHolder(signers[6].address);
      let adminFlag = account[2];
      // eslint-disable-next-line no-unused-expressions
      expect(adminFlag).to.be.true;
    });

    it("Admin should be able to setProvenanceHash", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKPlayers.connect(wallet).setProvenanceHash("HASH_STRING");
      // Assert
      const getHash = await TLKPlayers.PROVENANCE_HASH();
      await expect(getHash).to.be.eq("HASH_STRING");
    });

    it("Admin should be able to lockProvenance", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKPlayers.connect(wallet).lockProvenance();
      // Assert
      const getLock = await TLKPlayers.PROVENANCE_LOCK();
      await expect(getLock).to.be.true;
    });

    it("Admin should be able to setBaseURI", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      // const account = await TLKPlayers.getTLKPlayerHolder(signers[6].address);
      // console.log("Reserves: ", account[0]);
      await TLKPlayers.connect(wallet).setBaseURI("https://www.google.com/");
      await TLKPlayers.connect(wallet).adminMintIds([888]);
      // Assert
      const getBaseURI = await TLKPlayers.tokenURI(888);
      await expect(getBaseURI).to.be.eq("https://www.google.com/888");
    });

    it("Admin should be able to setContractURI", async function () {
      // Arrange
      const wallet = signers[6];
      // Act
      await TLKPlayers.connect(wallet).setContractURI("https://www.google.com/");
      // Assert
      const getContractURI = await TLKPlayers.contractURI();
      await expect(getContractURI).to.be.eq("https://www.google.com/");
    });

    it("Admin should be able to setMaxTLKPlayers", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKPlayers.connect(wallet).setMaxTLKPlayers(100000);
      // Assert
      const getMaxTLKPlayers = await TLKPlayers._maxTLKPlayers();
      await expect(getMaxTLKPlayers).to.be.eq(100000);
    });

    it("Admin should be able to setPlayerPrice", async function () {
      // Arrange
      const wallet = admins[0];
      let newPrice = ethers.utils.parseUnits((0.07).toString());
      // Act
      await TLKPlayers.connect(wallet).setPlayerPrice(newPrice);
      // Assert
      let getPlayerPrice = await TLKPlayers._priceTLKPlayers();
      getPlayerPrice = Number(ethers.utils.formatEther(getPlayerPrice)).toFixed(
        3
      );
      await expect(getPlayerPrice).to.be.eq("0.070");
      // return price to normal
      newPrice = ethers.utils.parseUnits((0.069).toString());
      await TLKPlayers.connect(wallet).setPlayerPrice(newPrice);
    });

    it("Owner should be able to setTreasury", async function () {
      // Arrange
      const wallet = owner;
      // Act
      await TLKPlayers.connect(wallet).setTreasury(wallet.address);
      // Assert
      let getTreasury = await TLKPlayers.connect(wallet)._treasuryAddress();
      await expect(getTreasury).to.be.eq(wallet.address);
    });

    it("Admin should be able to setRoyalty", async function () {
      // Arrange
      const wallet = admins[0];
      // Act
      await TLKPlayers.connect(wallet).setRoyalty(800);
      // Assert
      let royaltyAmount = await TLKPlayers.connect(wallet)._royaltyAmount();
      await expect(royaltyAmount).to.be.eq(800);
    });
  });

  describe("Get Contract Information", function () {
    it("Public should be able to getSale", async function () {
      // Arrange
      const wallet = signers[88];
      let passedTest = false;
      // Act
      let saleValue = await TLKPlayers.connect(wallet).getSale();
      // console.log("SaleValue: ", saleValue);
      // Assert
      await expect(saleValue).to.be.false;
    });

    it("PaintSwap should be able to get royaltyInfo", async function () {
      // Arrange
      const wallet = signers[88];
      let royaltyPass = false;
      let treasuryMatch = false;
      let testPass = false;
      let salePriceRaw = 25;
      let salePrice = ethers.utils.parseUnits((salePriceRaw).toString());
      let getTreasury = await TLKPlayers.connect(wallet)._treasuryAddress();
      // console.log("Treasury Address (contract) = ", getTreasury);
      // get royaltyAmount from contract
      let royaltyRate = await TLKPlayers.connect(wallet)._royaltyAmount();
      royaltyRate = Number(ethers.utils.formatUnits(royaltyRate,0));
      // console.log("Royalty Rate (contract) = ", royaltyRate);
      // Act
      let response = await TLKPlayers.connect(wallet).royaltyInfo(1,salePrice);
      // console.log("Response: ", response);
      // console.log("Treasury Address (response): ", response[0]);
      let returnedRoyaltyAmount = Number(Number(ethers.utils.formatEther(response[1])).toFixed(0));
      // console.log("Royalty Amount (response): ", returnedRoyaltyAmount);
      // Assert
      // Make sure the address returned matches the treasury address
      if (getTreasury === response[0])
        treasuryMatch = true;
      // Test the royalty amount
      royaltyRate = royaltyRate / 10000;
      // console.log("Royalty royaltyRate (calculated) = ", royaltyRate);
      calcPrice = royaltyRate * salePriceRaw;
      // console.log("CalcPrice = ", calcPrice);
      if (calcPrice === returnedRoyaltyAmount)
        royaltyPass = true;

      if (treasuryMatch && royaltyPass)
        testPass = true;
      await expect(testPass).to.be.true;
    });

    // it("Public should be able to tokenURI", async function () {
    //   // Arrange
    //   const wallet = signers[88];
    //   let passedTest = false;
    //   // Act
    //   let name = await TLKPlayers.connect(wallet).name();
    //   console.log("name: ", name);
    //   let symbol = await TLKPlayers.connect(wallet).symbol();
    //   console.log("symbol: ", symbol);
    //   let tokenURI = await TLKPlayers.connect(wallet).tokenURI(888);
    //   console.log("tokenURI: ", tokenURI);
    //   // Assert
    //   // await expect(saleValue).to.be.false;
    // });
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
        await TLKPlayers.connect(admins[i]).adminMintIds([adminNFTs[i]]);
        // eslint-disable-next-line no-await-in-loop
        let nftOwner = await TLKPlayers.connect(admins[i]).ownerOf([adminNFTs[i]]);
        // console.log("Owner NFT#", adminNFTs[i], " = ", nftOwner);
        if (nftOwner !== admins[i].address) {
          errorDetected = true;
        }
        // eslint-disable-next-line no-await-in-loop
        // let PlayerHolder = await TLKPlayers.getTLKPlayerHolder(admins[i].address);
        // console.log("Player Holder (", admins[i].address, "): ", PlayerHolder);
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
      let preSupply = await TLKPlayers.connect(purchaser).totalSupply();
      let numReserved = reservedIDs.length;
      // console.log("numReserved: ", numReserved);
      // console.log("PreSupply: ", preSupply);
      // Act
      await TLKPlayers.connect(purchaser).adminMintIds(reservedIDs);
      let postSupply = await TLKPlayers.connect(purchaser).totalSupply();
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
      await TLKPlayers.connect(admin).setSale(true);
    });

    afterEach(async function () {
      const admin = admins[0];
      await TLKPlayers.connect(admin).setSale(true);
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const timestamp = block.timestamp;
    });

    it("Should not be able to mint before sale is active", async function () {
      // Arrange
      const admin = admins[0];
      await TLKPlayers.connect(admin).setSale(false);
      const buyAmount = 5;
      const purchaser = purchasers[0];
      const value = ethers.utils.parseUnits((0.069 * buyAmount).toString());
      // Act
      const res = TLKPlayers.connect(purchaser).mintPlayer(buyAmount, { value });
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
      let preBalance = await ethers.provider.getBalance(TLKPlayers.address);
      preBalance = Number(ethers.utils.formatEther(preBalance)).toFixed(3);
      // console.log("TLKPlayers Balance (pre): ", preBalance);
      // Calculate purchase price
      const value = ethers.utils.parseUnits((0.069 * 5).toString());
      // Act
      await TLKPlayers.connect(purchasers[0]).mintPlayer(5, { value });
      // Check updated balance
      let postBalance = await ethers.provider.getBalance(TLKPlayers.address);
      postBalance = Number(ethers.utils.formatEther(postBalance)).toFixed(3);
      // console.log("TLKPlayers Balance (post): ", postBalance);
      let targetBalance = Number(Number(preBalance) + 0.069 * 5).toFixed(3);
      // console.log("Target Value: ", targetBalance);
      // Assert
      expect(postBalance).to.be.eq(targetBalance);
    });

    it("Purchase 500 NFTs from 100 purchaser wallets", async function () {
      // Arrange
      const purchaser = admins[0];
      const value = ethers.utils.parseUnits((0.069 * 5).toString());
      let preSupply = await TLKPlayers.connect(purchaser).totalSupply();
      // console.log("PreSupply: ", preSupply);
      // Act
      // Loop through and buy the MAX NFTs from each purchaser wallet
      for (let i = 0; i < 100; i++) {
        // eslint-disable-next-line no-await-in-loop
        // console.log("Minting 5 NFTs for Address: ", purchasers[i].address);
        // eslint-disable-next-line no-await-in-loop
        await TLKPlayers.connect(purchasers[i]).mintPlayer(5, { value });
      }
      let postSupply = await TLKPlayers.connect(purchaser).totalSupply();
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
      let contractBalance = await provider.getBalance(TLKPlayers.address);
      contractBalance = Number(
        ethers.utils.formatEther(contractBalance)
      ).toFixed(3);
      // console.log("contractBalance = ", contractBalance);
      let treasuryAddress = await TLKPlayers._treasuryAddress();
      let treasuryBalance = await provider.getBalance(treasuryAddress);
      treasuryBalance = Number(
        ethers.utils.formatEther(treasuryBalance)
      ).toFixed(3);
      // console.log("treasuryBalance = ", treasuryBalance);
      await TLKPlayers.connect(wallet).depositTreasury();
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
