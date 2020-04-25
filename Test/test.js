const erc20Abi = require('../Abi/erc20.json');
const abiDecoder = require('abi-decoder');
abiDecoder.addABI(erc20Abi);
const _ = require('lodash');
const Web3 = require('web3');
let web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/v3/ec65db126da644e2bc5088d43df4e73f'));

/////////////////////////////////////////////////////////////////
// function fetchDecoder(param) {
//     if (!param && param === '0x') {
//         return null;
//     }
//     const result = abiDecoder.decodeMethod(param);
//     return result;
// }
// let result = fetchDecoder("0xa9059cbb000000000000000000000000b19874fdd1d9d1b88c1651f4c532f3a1fd2ddb8b00000000000000000000000000000000000000000000006c6b935b8bbd400000");
// console.log(result);
/////////////////////////////////////////////////////////////////
// async function fetchTransactionCountAsync(param) {
//     const result = await web3.eth.getTransactionCount(param);
//     return result;
// }
// (async() => {
//     let result = await fetchTransactionCountAsync("0xA1Edc78199a6e56Fd52F69cf7C10F67dEd15185D");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchFromWeiAsync(param) {
//     return await web3.utils.fromWei(web3.utils.toBN(parseFloat(param).toLocaleString('fullwide', { useGrouping: false })), 'ether')
// }
// (async() => {
//     let result = await fetchFromWeiAsync("197900000000000000000");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchBalanceOfAsync(param01, param02) {
//     let contract = new web3.eth.Contract(erc20Abi, param01);
//     return await contract.methods.balanceOf(param02).call().catch(() => undefined);
// }
// (async() => {
//     let result = await fetchBalanceOfAsync("0x6c6ee5e31d828de241282b9606c8e98ea48526e2" ,"0x7A91a362d4f2c9C4627688D5B7090BBB12e5715f");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchTotalSupplyAsync(param) {
//     let contract = new web3.eth.Contract(erc20Abi, param);
//     return await contract.methods.totalSupply().call().catch(() => undefined);
// }
// (async() => {
//     let result = await fetchTotalSupplyAsync("0x6c6ee5e31d828de241282b9606c8e98ea48526e2");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchSymbolAsync(param) {
//     let contract = new web3.eth.Contract(erc20Abi, param);
//     return await contract.methods.symbol().call().catch(() => undefined);
// }
// (async() => {
//     let result = await fetchSymbolAsync("0xFf2662264693f2fF4F75736B8877b7033e6aE925");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchBalanceAsync(param) {
//     const result = await web3.eth.getBalance(param);
//     return result;
// }
// (async() => {
//     let result = await fetchBalanceAsync("0xE93381fB4c4F14bDa253907b18faD305D799241a");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchTransactionAsync(param) {
//     const result = await web3.eth.getTransaction(param);
//     return result;
// }
// (async() => {
//     let result = await fetchTransactionAsync("0xd668e6199fe597d641d0d7b1f06ddbe244269da3c5c0edc10b67f23f77b06d55");
//     console.log(result);
// })();
/////////////////////////////////////////////////////////////////
// async function fetchBlockAsync(param) {
//     const result = await web3.eth.getBlock(param, true);
//     return result;
// }
// (async() => {
//     let result = await fetchBlockAsync(9940541);
//     console.log(result);
// })();

/////////////////////////////////////////////////////////////////
// (async () => {
// let StartingBlock = 9940831;
// let EndingBlock = 9940831;
//     const result = Array.from({ length: EndingBlock - StartingBlock + 1 }, (_, x) => x + StartingBlock);

//     console.log(result);
//     console.log(result.map(x => x));

//     let resultAll = await Promise.all(result.map(x => fetchBlockAsync(x)));
//     console.log(resultAll[0].transactions);
// })();
// return Promise.all(blocksRange.map(blockNumber => services.eth.fetchBlock(blockNumber, info)));
/////////////////////////////////////////////////////////////////