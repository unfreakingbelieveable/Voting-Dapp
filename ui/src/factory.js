import { web3 } from './web3';
const factoryABI = require('./abi/VoteFactory.json');

const factoryAddr = '0xCa551016676D0d88A2edeaF3E9Cb9cB2205F3f86';

export default new web3.eth.Contract(factoryABI.abi, factoryAddr);