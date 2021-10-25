import { web3 } from './web3';
const factoryABI = require('./abi/VoteFactory.json');

const factoryAddr = '0x8dF3b210283F08eC30da4e8fF8bf62981FbBef34';

export default new web3.eth.Contract(factoryABI.abi, factoryAddr);