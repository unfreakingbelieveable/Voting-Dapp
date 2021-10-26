import { web3 } from './web3';
const factoryABI = require('./abi/VoteFactory.json');

const factoryAddr = '0x4a81cff73f1b8c6d94f50EDC08A4DEe7fbC109C6';

export default new web3.eth.Contract(factoryABI.abi, factoryAddr);