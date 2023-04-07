// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Voting is OwnableUpgradeable{

    uint public unlockTime;

    struct User 
    {
        bool candidate;
        bool vote;
        uint256 votes;
        bool register;
    }

    mapping(address => User) public Users;

    address[] public candidates;

    

    function initialize() initializer public{

        __Ownable_init();

        unlockTime = block.timestamp;

    }


    function register() public validateRegister(msg.sender) {

        Users[msg.sender].candidate = false;
        Users[msg.sender].vote = false;
        Users[msg.sender].votes = 0;
        Users[msg.sender].register = true;
    

    }

    function registerCandidate(address candidate) public onlyOwner() validateRegisterCandidate(candidate) {

        require(candidates.length <= 5, "Only 5 Candidates");

        Users[candidate].candidate = true;

        candidates.push(candidate);


    }


    function voting(address candidate) public {

        require((7 days - (block.timestamp - unlockTime)) < 7 days,"Voting Completed");
        require(Users[msg.sender].register == true, "Unregistered");
        require(Users[msg.sender].vote == false, "Already Voted");
        require(Users[candidate].register == true, "Candidate Unregistered");
        require(Users[candidate].candidate == true, "Not Candidate");
        require(candidate != msg.sender, "Do Not Vote For Yourself");

        Users[candidate].votes += 1;
        Users[msg.sender].vote = true;
      

    }

    modifier validateRegister(address user) {

        require(Users[user].register == false, "Already Aegistered");
            _;
        
    }


    modifier validateRegisterCandidate(address candidate) {

        require(Users[candidate].register == true, "Unregistered");
        require(Users[candidate].candidate == false, "Is Already a Candidate");
            _;
        
    }
    

}