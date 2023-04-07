const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

const { ethers, upgrades } = require("hardhat");

describe("Voting", function () {

   
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployLottery() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;
    
        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await upgrades.deployProxy(Voting,{

            initialize: "initialize",
            

        });

        const ContractVoting = await voting.deployed();

    
        return { ContractVoting, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should Deploy", async function () {
          const { ContractVoting, owner } = await loadFixture(deployLottery);
    
          expect(await ContractVoting.owner()).to.equal(owner.address);
        });

    });


    describe("Register",function (){

      it("Should ", async function () {
        const { ContractVoting, owner } = await loadFixture(deployLottery);
  
        expect(await ContractVoting.owner()).to.equal(owner.address);
      
      });


    });

});
