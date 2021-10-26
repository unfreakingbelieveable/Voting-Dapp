Basic react frontend and smart contract backend for voting. I apologize for the rough front end.

As of right now the only way to run this is locally. If you wish to deploy this to a test network you will have to set up the migrations yourself and copy down the address that the VoteFactory contract is deployed to.

Usage:
  1) start ganache locally
  2) run truffle migrate and get the deployed VoteFactory address
  3) paste address into ui/src/factory.js
  4) run npm start inside the ui directory
