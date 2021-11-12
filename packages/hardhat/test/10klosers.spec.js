const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
require("mocha-steps");
const chaiAsPromised = require("chai-as-promised");

// this is how you added plugins to mocha
use(solidity);
use(chaiAsPromised);

// these variables globally
let signers; // this is an array of accounts
let DaWFactory;
let admin;
let daw;
let beforeWithdraw;

// get block time
let timestamp;
let blockNum;
let block;


let teamSigners;
const teamShares = [4000, 4000, 667, 667, 666];
let donationAddress;
let donationSigner;
let teamClaimSigners;

// === Uint Testing Framework ===

// Arrange

// Act

// Assert

describe("DesperateApeWives", function () {
  before(async function () {
    // get all of the signers created in hardhat.config.js
    signers = await ethers.getSigners();
    // assign the first signer in the array as the admin to test onlyAdmin
    admin = signers[0];
    // create the contract
    DaWFactory = await ethers.getContractFactory("DesperateApeWives");

    /*

        const team = [ // distribution
    "0xB80Ed04DAf88401f20752bB40490B82f73de8687", // The Gardener - 40
    "0xc43b7017871c611a23366584C487dc3aaf3C09EC", // Archer - 40
    "0xad8259E83B4a48a97360eDcb808A2D2bf3aCE191", // Jim 6.67
    "0x5F7aAc1728F23cB06bA806741F0Fff373Eb581bA", // Wendi 6.67
    "0x67aaEf4a6F49A27cf90789EAD73ba1D189B050D3", // Kelvin 6.66
  ]

  const teamShares = [40, 40, 6.66, 6.66, 6.67]

  const teamClaimNFTs = [ // NFT tokens -- distro address
    "0x47938b89db2377505Df98A9b9A92Ce97B5a236D9", // 12 The Gardener
    "0x3635eF8Adb194cDAeC5B542aF8ADA8DBeDF54b2f", // 13
    "0x6e590EF64aBBAade91E358FEB46295df3365A8e6", // 12 Archer
    "0xdce671E7301061E0717961F2A3891a24b01c12b7", // 13
    "0xCA9DBB919a563D6dE2999e071Ce77e51690E8BFd", // - Kelvin --
    "0x402905d2AA5D66515D51FAF2dFA4e350634dd20A", // - Jim
    "0x9f613f77413C9c08b415c8ACCA7bdE9d060D6A90", // - Wendi
    "0x5249Ec348EB8cD970778f6F9f8e38Ff2400D7634" // The Gardener Admin
  ]

  // const donationWallet = "0x5B5497181baf726a6FaaDeA9eB4f0281153D8088" // this will recieve the personally minted tokens
  const donationWallet = "0x47Ef4Eb0d047Daf2FA7152c5F9Ba8FC4Ea5A957F"

     */

    const team = [
      // withdraw
      signers[90].address,
      signers[91].address,
      signers[92].address,
      signers[93].address,
      signers[94].address,
    ];

    teamSigners = [ // NFTs
      signers[80],
      signers[81],
      signers[82],
      signers[83],
    ];

    const teamClaimNFTs = [
      // claim + admin rights
      signers[80].address,
      signers[81].address,
      signers[82].address,
      signers[83].address,
      signers[84].address,
      signers[85].address,
      signers[86].address,
      signers[87].address,
    ];

   teamClaimSigners = [
      // claim + admin rights
      signers[80],
      signers[81],
      signers[82],
      signers[83],
      signers[84],
      signers[85],
      signers[86],
      signers[87],
    ];

    donationAddress = signers[7].address;
    donationSigner = signers[7]

    daw = await DaWFactory.connect(admin).deploy(
      team, // team
      teamShares, // team_shares
      teamClaimNFTs,
      donationAddress
    );

  });

  describe("Admin Functions", function () {
    it("should not be be able to toggleSale", async function () {
      // Arrange
      const attacker = signers[1];
      // Act
      const tryToEdit = daw.connect(attacker).activateSale();
      // Assert
      await expect(tryToEdit).to.be.rejectedWith(
        "Nice try! You need to be an admin"
      );
    });

    it("should allow admin to toggleSale", async function () {
      // Arrange
      let isSaleLive;
      // Act
      await daw.connect(admin).activateSale();
      isSaleLive = await daw._isSaleLive();
      // Assert
      expect(isSaleLive).to.be.a("boolean");
      expect(isSaleLive).to.be.equal(true);
    });

    it("should claim donations for the admin", async function() {
      await daw.connect(admin).claimDonations();
      const a1 = await daw.ownerOf(1);
      const a2 = await daw.ownerOf(2);
      expect(a1 && a2).to.be.equal(donationAddress)
    })

    it.skip("should allow admin to mint the reserve and decrease amount", async function () {
      // Arrange

      // Act
      await daw.connect(admin).adminMint(20);
      const reserved = await daw._reserved();
      const currentAccount = await daw.connect(admin).getAccount(admin.address);
      // Assert
      expect(currentAccount.nftsReserved).to.equal(0); // this is 25 because it started at 45 and then it decrease tby the amount purchase which is 20
      // expect(reserved).to.equal(25)
    });

    it("should allow onlyOwner to setAdmin", async function () {
      // Arrange
      const newAdmin = signers[1].address;
      // Act
      await daw.connect(admin).setAdmin(newAdmin);
      const account = await daw.getAccount(newAdmin);
      // Assert
      expect(account.isAdmin).to.be.true;
    });

    it("should allow admin to set whitelist", async function () {
      // Arrange
      const newEarlyAdopter = signers[1].address;
      // Act
      await daw.connect(admin).setWhitelist([newEarlyAdopter]);
      const account = await daw.getAccount(newEarlyAdopter);
      // Assert
      expect(account.isWhitelist).to.be.true;
    });

    it("should allow admin to set Early Supporters", async function () {
      // Arrange
      const newEarlyAdopter = signers[1].address;
      // Act
      await daw.connect(admin).setEarlySupporters([newEarlyAdopter]);
      const account = await daw.getAccount(newEarlyAdopter);
      // Assert
      expect(account.isEarlySupporter).to.be.true;
    });

    it("should return all sale timestamps", async function () {
      // Arrange
      const timestamps = await daw.getSaleTimes();
      // Act
      const numberTimeStamps = timestamps.map((x) => x.toNumber());
      // Assert
      expect(numberTimeStamps).to.be.length(3);
    });
  });

  describe("Minting", function () {
    before(async function () {
      await daw.connect(admin).activateSale();
    });

    afterEach(async function () {
      await daw.connect(admin).activateSale();
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;
      await daw.setSaleTimes([timestamp, timestamp + 4000, timestamp + 3000]);
    });


    it("should not be able to mint before sale is active", async function () {
      // Arrange
      await daw.connect(admin).deactivateSale();
      const buyAmount = 5;
      const signer = signers[4];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith("Sale must be active to mint");
    });

    it("should not be able to mint before presale starts", async function () {
      // Arrange
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;
      await daw.setSaleTimes([
        timestamp + 5000,
        timestamp + 4000,
        timestamp + 3000,
      ]);
      const buyAmount = 5;
      const signer = signers[23];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith(
        "You must wait till presale begins to mint"
      );
    });

    it("should not be able to mint unless on a whitelist", async function () {
      // Arrange
      const buyAmount = 2;
      const signer = signers[3];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith(
        "Sorry you need to be on Whitelist"
      );
    });

    it("should not be able to buy more than 10", async function () {
      // Arrange
      const buyAmount = 11;
      const signer = signers[20];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith(
        "Sorry you need to be on Whitelist"
      );
    });

    it("should not be able to try to buy -1", async function () {
      // Arrange
      const buyAmount = -1;
      const signer = signers[20];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith(
        'value out-of-bounds'
      );
    });

    it("should not allow user to send incorrect amount", async function () {
      // Arrange
      const buyAmount = 2;
      const signer = signers[20];
      const value = ethers.utils.parseUnits((0.06 * buyAmount).toString());
      // Act
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      // await expect(res).to.be.rejectedWith(Error, "VM Exception while processing transaction: reverted with reason string 'Ether value sent is not correct'")
      await expect(res).to.be.rejectedWith("Ether value sent is not correct");
    });

    it("should not allow Early Supporter to mint more than 10 per wallet", async function () {
      // Arrange
      const buyAmount = 11;
      const signer = signers[10];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const setSupporter = await daw
        .connect(admin)
        .setEarlySupporters([signer.address]);
      await setSupporter.wait();
      const res = daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      await expect(res).to.be.rejectedWith(
        "Wallet Limit Reached"
      );
    });

    it("should be able to mint as Early Supporter", async function () {
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;
      await daw.setSaleTimes([timestamp - 1000, timestamp + 4000, timestamp + 3000]);
      // Arrange
      const buyAmount = 10;
      const signer = signers[10];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const setSupporter = await daw
        .connect(admin)
        .setEarlySupporters([signer.address]);
      await setSupporter.wait();
      await daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      const getAccount = await daw.getAccount(signer.address);
      const newBalance = getAccount.mintedNFTs;
      expect(newBalance).to.be.equal(buyAmount);
    });

    it("should be able to mint as an Early Adopter", async function () {
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;
      await daw.setSaleTimes([timestamp - 1000, timestamp + 4000, timestamp + 3000]);
      // Arrange
      const buyAmount = 2;
      const signer = signers[5];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());
      // Act
      const setSupporter = await daw
        .connect(admin)
        .setWhitelist([signer.address]);
      await setSupporter.wait();
      await daw.connect(signer).mintWife(buyAmount, { value });
      // Assert
      const getAccount = await daw.getAccount(signer.address);
      const newBalance = getAccount.mintedNFTs;
      expect(newBalance).to.be.equal(buyAmount);
    });

    it("should be able to buy public sale and increase mintedNFTs", async function () {
      // Arrange

      const buyAmount = 3;
      const signer = signers[33];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());

      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      // set to BAYCorMAYC
      await daw.setSaleTimes([
        timestamp - 50000,
        timestamp - 40000,
        timestamp - 60000,
      ]);

      // Act
      await daw.connect(signer).mintWife(buyAmount, { value });

      // Assert
      const getAccount = await daw.getAccount(signer.address);
      const newBalance = getAccount.mintedNFTs;
      expect(newBalance).to.be.equal(buyAmount);
    });

    it("should not be able to mint max and transfer to mint more", async function () {
      const buyAmount = 3;
      const signer = signers[34];
      const sender = signers[35];
      const value = ethers.utils.parseUnits((0.08 * buyAmount).toString());

      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      // set to BAYCorMAYC
      await daw.setSaleTimes([
        timestamp - 50000,
        timestamp - 40000,
        timestamp - 60000,
      ]);

      // Act

      await daw.connect(signer).mintWife(buyAmount, { value });
      const tokenId = (
        await daw.tokenOfOwnerByIndex(signer.address, 0)
      ).toNumber();
      await daw
        .connect(signer)
        .transferFrom(signer.address, sender.address, tokenId);
      const doesSenderHaveToken = await daw.ownerOf(tokenId);
      console.log("Token Did transfer", doesSenderHaveToken === sender.address);
      const res = daw
        .connect(signer)
        .mintWife(2, { value: ethers.utils.parseUnits((0.08 * 2).toString()) });

      // Assert
      await expect(res).to.be.rejectedWith(
        "Sorry you can only mint 3 per wallet"
      );
    });

    it("should sell out with all reserves", async function () {
      // arrange
      console.log((await daw.totalSupply()).toNumber());
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;
      await daw.setSaleTimes([
        timestamp - 50000,
        timestamp - 40000,
        timestamp - 60000,
      ]);

      const leftForPublic =
        (await daw.MAX_WIVES()) -
        ((await daw.totalSupply()).toNumber() + (await daw._reserved()).toNumber());
      console.log({ leftForPublic });
      // act
      this.timeout(600 * 15000);
      let i = 0;
      while (i++ < 8000) {
        try {
          const left =
            (await daw.MAX_WIVES()) -
            ((await daw.totalSupply()).toNumber() + (await daw._reserved()).toNumber());
          if (left === 0) break;
          if (left > 0) {
            await daw.connect(signers[i + 200]).mintWife(Math.min(3, left), {
              value: ethers.utils.parseUnits((0.08 * Math.min(3, left)).toString()),
            });
            console.log("Minting", (await daw.totalSupply()).toNumber());
          }
        } catch (e) {
          console.log("Zero Left");
          console.log("Last Index: ", i);
          console.log("Error Message", e);
          const leftForPublic =
            (await daw.MAX_WIVES()) -
            ((await daw.totalSupply()).toNumber() + (await daw._reserved()).toNumber());
          const reserved = (await daw._reserved()).toNumber();
          console.log({ reserved });
          console.log({ leftForPublic });
          done();
          break;
        }
      }

      console.log((await daw.totalSupply()).toNumber());
    });

    it("should allow all admins to mint remaining reserves", async function () {
      console.log((await daw._reserved()).toNumber());

      const res = teamClaimSigners.map(async (x) => {
        await daw.connect(x).adminMint();
      });

      await Promise.all(res);

      const totalSupply = (await daw.totalSupply()).toNumber();
      console.log({ totalSupply });

      // get the max token supply and check that the total supply === maxToken supply

      // have to figure out a way to wait
      const maxTokens = (await daw.MAX_WIVES()).toNumber();
      console.log({totalSupply, maxTokens})
      expect(maxTokens).to.be.equal(totalSupply);

      // take the totalSupply - the reserve and have a bunch of accounts buy it out
    });

    it("should allow owner to withdraw balance from smart contract", async function () {
      // Arrange
      let contractBalance = await daw.showBalance();
      beforeWithdraw = ethers.utils.formatEther(contractBalance);
      console.log("Before withdraw", beforeWithdraw);
      // Act
      await daw.releaseFunds();
      contractBalance = await daw.showBalance();
      console.log("After withdraw", ethers.utils.formatEther(contractBalance));
      // Assert
      expect(contractBalance).to.be.equal(0);
    });

    it("should verify all funds split according to shares described in contract", async function () {
      console.log(beforeWithdraw)
      // Arrange
      console.log("Current Balance", await daw.showBalance())

      const teamAddress = [
        // these are the addresses that were use to instantiate the contract
        signers[90],
        signers[91],
        signers[92],
        signers[93],
        signers[94],
      ];

      const receiverBalance = teamAddress.map(async (x) => {
        const num = await x.getBalance();
        console.log({num})
        console.log(ethers.utils.formatEther(num))
        return ethers.utils.formatEther(num) - 300;
      });

      const finalBalances = await Promise.all(receiverBalance);
      console.log({finalBalances})
      // Act
      const finalSplitPaymentForAddress = () => {
        return teamShares.map((x, i) => {
          console.log(x)
          console.log(finalBalances[i].toFixed(3))
          console.log((beforeWithdraw * (x * .0001)).toFixed(3))
          return (
            finalBalances[i].toFixed(3) === (beforeWithdraw * (x * 0.0001)).toFixed(3)
          );
        });
      };

      const final = finalSplitPaymentForAddress().reduce((x) => x === true);
      console.log({final})

      // Assert
      expect(final).to.be.true;
    });


    // it("should sell out public sell + reserves", async function () {
    //   // find current state of the contract at this point
    //   // create function to log out the state of the contract
    // })
  });
});

/*
  Features:

  Sale Time Structure:
   - Presale is for 24 hours
   - public sale starts 1 hours after the end of presale

  Presale Start 10/6/21 12am EST =>
  Presale End 10/7/21 12am EST =>
  Public Sale 10/7/21 1pm EST =>

  Limit Structure: ?? is the 500 number wallets? are they going to provide the wallets?
  Early Supporters Role - 10/Wallet
  Early Adapter Role - 2/wallet todo -> add test for this
  BAYC/MAYC Holders - 2/wallet todo -> add test for this
  Public sale - 5/wallet

 */

// setAdmin - ✅
// setEarlySupporters - new ✅
// setBAYCorMAYC - new ✅
// setEarlyAdopters - new ✅

// getSaleTimes ✅
// how can i verify that a group of times is return back that i can see on my end????

// setBaseURI
// setContractURI
// setProvenanceHash
// lockProvenance

// adminMint ✅
// adminClaim - team can claim tokens ✅
// admin airdrop -
// mint -
// public mint -
// the contract should sell out (it should reach 10k with all of the claims and airdrops)

// releaseFunds - verify all funds were split according to the assigned percentages  ✅
// user should only be able to by 2 tokens per BAYC token; ✅
// early supporters user should only be able to by 10 ✅
// early adopters user should only be able to by 2 ✅

/*
  it("", async function () {
    // Arrange
    // Act
    // Assert
    await expect().to.be.rejectedWith(Error, "")
  })
*/
