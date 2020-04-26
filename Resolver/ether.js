const erc20Abi = require('../Abi/erc20.json');
const abiDecoder = require('abi-decoder');
abiDecoder.addABI(erc20Abi);
const _ = require('lodash');
const Web3 = require('web3');
let web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider(process.env.NODE_ENV == 'production' ? process.env.HTTP_PROVIDER_URL_PROD : process.env.HTTP_PROVIDER_URL_TEST));

/////// BLOCK

async function fetchBlockAsync(param){
    const result = await web3.eth.getBlock(param, true);
    return result;
}

/////// TRANSACTION

async function fetchTransactionAsync(param) {
    const result = await web3.eth.getTransaction(param);
    return result;
}

async function fetchTransactionReceiptAsync(param) {
    const result = await web3.eth.getTransactionReceipt(param);
    return result;
}

async function fetchTransactionCountAsync(param) {
    const result = await web3.eth.getTransactionCount(param);
    return result;
}

/////// ACCOUNT

async function fetchBalanceAsync(param) {
    const result = await web3.eth.getBalance(param);
    return fetchFromWei(result);
}

/////// CONTRACT

async function fetchSymbolAsync(param) {
    let contract = new web3.eth.Contract(erc20Abi, param);
    return await contract.methods.symbol().call().catch(() => undefined);
}

async function fetchTotalSupplyAsync(param) {
    let contract = new web3.eth.Contract(erc20Abi, param);
    return fetchFromWei(await contract.methods.totalSupply().call().catch(() => undefined));
}

async function fetchBalanceOfAsync(param01, param02) {
    let contract = new web3.eth.Contract(erc20Abi, param01);
    return fetchFromWei(await contract.methods.balanceOf(param02).call().catch(() => undefined));
}

/////// UTILS

function fetchFromWei(param) {
    return web3.utils.fromWei(web3.utils.toBN(parseFloat(param).toLocaleString('fullwide', { useGrouping: false })), 'ether')
}

function fetchDecoder(param) {
    if (!param || param === '0x') {
        return null;
    }
    const result = abiDecoder.decodeMethod(param);
    if (typeof result === 'undefined') {
        return null;
    }
    return result;
}

module.exports = {
    fetchBlockAsync,
    fetchTransactionAsync,
    fetchTransactionReceiptAsync,
    fetchTransactionCountAsync,
    fetchBalanceAsync,
    fetchSymbolAsync,
    fetchTotalSupplyAsync,
    fetchBalanceOfAsync,
    fetchFromWei,
    fetchDecoder
}