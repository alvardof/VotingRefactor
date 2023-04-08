const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

const { expect } = require("chai");

const { ethers, upgrades } = require("hardhat");

describe("Voting", function () {


    async function deployLottery() {

        const [owner, otherAccount, user_1, user_2 , user_3,user_4,user_5,user_6] = await ethers.getSigners();
    
        const Voting = await ethers.getContractFactory("Voting");
        const voting = await upgrades.deployProxy(Voting,{

            initialize: "initialize",
            

        });

        const ContractVoting = await voting.deployed();

    
        return { ContractVoting, owner, otherAccount, user_1, user_2, user_3,user_4,user_5,user_6 };
    }

    describe("Deployment", function () {
        it("Should Deploy", async function () {
          const { ContractVoting, owner } = await loadFixture(deployLottery);
    
          expect(await ContractVoting.owner()).to.equal(owner.address);

        });

    });


    describe("Register",function (){

      it("Should Register", async function () {
        const { ContractVoting, owner, user_1 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);

      });

      it("Should Already Aegistered", async function () {

        const { ContractVoting, owner, user_1 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);


        await expect(ContractVoting.connect(user_1).register())
        .to.be.revertedWith('Already Aegistered');

      });

    });


    describe("registerCandidate",function (){


      it("Should only owner", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        expect(await ContractVoting.owner()).to.equal(owner.address);

        await expect(ContractVoting.connect(user_2).registerCandidate(user_1.address))
        .to.be.revertedWith('Ownable: caller is not the owner');

      });

      it("Should Must be registered", async function () {
        
        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        expect(await ContractVoting.owner()).to.equal(owner.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.be.revertedWith('Unregistered');

      
      });

      it("Should register candidate", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        expect(await ContractVoting.owner()).to.equal(owner.address);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);


        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_1.address);

      });

      it("Should One register", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        expect(await ContractVoting.owner()).to.equal(owner.address);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);


        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.be.revertedWith('Is Already a Candidate');

      });


      it("Should maximum 5 candidates", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        expect(await ContractVoting.owner()).to.equal(owner.address);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_2).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_2.address);

        await expect(ContractVoting.connect(user_3).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_3.address);

        await expect(ContractVoting.connect(user_4).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_4.address);

        await expect(ContractVoting.connect(user_5).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_5.address);

        await expect(ContractVoting.connect(user_6).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_6.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_2.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_2.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_3.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_3.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_4.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_4.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_5.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_5.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_6.address))
        .to.be.revertedWith('Only 5 Candidates');

      });

    });

    describe("Voting",function (){

      it("Should Voting Completed", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        const seven_days = 8 * 24 * 60 * 60;
      
        const unlockTime = (await time.latest()) + seven_days;

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        await expect(ContractVoting.connect(user_1).register())

        await expect(ContractVoting.connect(user_2).voting(user_1.address))

        await expect(ContractVoting.connect(user_2).voting(user_1.address))
        .to.be.revertedWith('Voting Completed');
      
      });

      it("Should Voting Unregistered", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).voting(user_2.address))
        .to.be.revertedWith('Unregistered');

      });

      it("Should Not Candidate", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_2).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_2.address);

        await expect(ContractVoting.connect(user_1).voting(user_2.address))
        .to.be.revertedWith('Not Candidate');


      });

      it("Should Already Voted", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_2).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_2.address);

        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_2).voting(user_1.address))
        .to.emit(ContractVoting, 'voting_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_2).voting(user_1.address))
        .to.be.revertedWith('Already Voted');

      });

      it("Should Do Not Vote For Yourself", async function () {

        const { ContractVoting, owner, user_1, user_2, user_3,user_4,user_5,user_6 } = await loadFixture(deployLottery);

        await expect(ContractVoting.connect(user_1).register())
        .to.emit(ContractVoting, 'register_event')
        .withArgs(user_1.address);


        await expect(ContractVoting.connect(owner).registerCandidate(user_1.address))
        .to.emit(ContractVoting, 'registerCandidate_event')
        .withArgs(user_1.address);

        await expect(ContractVoting.connect(user_1).voting(user_1.address))
        .to.be.revertedWith('Do Not Vote For Yourself');

        

      });


    });

});
