const VoteFactory = artifacts.require("VoteFactory");
const Vote = artifacts.require("Vote");

const path = require('path');
const fs = require('fs');

const addrPath = path.resolve('../', 'ui', 'src', 'abi', 'factoryAddress.txt');
const now = Math.round(Date.now() / 1000)

module.exports = async function (deployer) {
  await deployer.deploy(VoteFactory);
  let factory = await VoteFactory.deployed();
  
  // Put the address somewhere so react app can use it
  fs.writeFileSync(addrPath, factory.address);

  //await deployer.deploy(Vote, 'test', now + (2 * 60), now + (3 * 60), now + (4 * 60));
};
