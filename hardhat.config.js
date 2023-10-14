require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');




/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      gas: 2100000,
      gasPrice: 8000000000,
      }
    },
  solidity: "0.8.17"
};
