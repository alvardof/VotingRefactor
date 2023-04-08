// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Voting is OwnableUpgradeable{

    uint public unlockTime;
    uint public seven_days;

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

        seven_days = 7 * 24 * 60 * 60;

    }


    function register() public validateRegister(msg.sender) {

        Users[msg.sender].candidate = false;
        Users[msg.sender].vote = false;
        Users[msg.sender].votes = 0;
        Users[msg.sender].register = true;

        emit register_event(msg.sender);

    }

    function registerCandidate(address candidate) public onlyOwner() validateRegisterCandidate(candidate) {

        require(candidates.length < 5, "Only 5 Candidates");

        Users[candidate].candidate = true;

        candidates.push(candidate);

        emit registerCandidate_event(candidate);


    }

   

    function voting(address candidate) public {
        
        require((block.timestamp - unlockTime) < seven_days,"Voting Completed");
        
        require(Users[msg.sender].register == true, "Unregistered");
        require(Users[candidate].candidate == true, "Not Candidate");
        require(Users[msg.sender].vote == false, "Already Voted");
        require(candidate != msg.sender, "Do Not Vote For Yourself");

        Users[candidate].votes += 1;
        Users[msg.sender].vote = true;

        emit voting_event(candidate);
        
      

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

    /* ========== EVENTS ========== */

	event register_event(address user);

    event registerCandidate_event(address user);

    event voting_event(address candidate);

    

    

}