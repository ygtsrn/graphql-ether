const _ = require('lodash');
const Web3 = require('web3');
let web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider(process.env.SYSTEM_MOD == 'PROD' ? process.env.HTTP_PROVIDER_URL_PROD : process.env.HTTP_PROVIDER_URL_TEST));

async function fetchBlockAsync(param){
    const result = await web3.eth.getBlock(param, true);
    return result;
}

module.exports = {
    fetchBlockAsync
}