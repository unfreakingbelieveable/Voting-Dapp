import Web3 from 'web3';

let accounts;

const getAccounts = async () => {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
}

getAccounts();

const web3 = new Web3(window.ethereum);

export { web3, accounts };