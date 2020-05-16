const graphql = require('graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType,
    GraphQLList,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLEnumType
} = graphql;
const _ = require('lodash');
const funcEther = require('../Resolver/ether');

const TokenType = new GraphQLObjectType({
    name: 'Token',
    fields: {
        symbol: {
            type: GraphQLString,
            async resolve (parent) {
                let result = await funcEther.fetchSymbolAsync(parent.ContractAddress);
                return result;
            }
        },
        balance: {
            type: GraphQLString,
            async resolve(parent) {
                let result = await funcEther.fetchBalanceOfAsync(parent.ContractAddress, parent.AccountAddress);
                return result;
            }
        }
    }
});

const AccountType = new GraphQLObjectType({
    name: 'Account',
    fields: {
        balance: {
            type: GraphQLString,
            async resolve(parent) {
                let result = await funcEther.fetchBalanceAsync(parent);
                return result;
            }
        },
        transactionCount: {
            type: GraphQLInt,
            async resolve(parent) {
                let result = await funcEther.fetchTransactionCountAsync(parent);
                return result;
            }
        },
        token:{ 
            type: TokenType,
            args: {
                Contract: { type: GraphQLString }
            },
            async resolve(parent, { Contract }) {
                return {AccountAddress: parent, ContractAddress: Contract};
            }
         }
    }
});

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
        address: { type: GraphQLString, resolve: (parent) => { return parent; } },
        account: { type: AccountType, resolve: (parent) => { return parent; } }
    }
});

const ContractType = new GraphQLObjectType({
    name: 'Contract',
    fields: {
        symbol: {
            type: GraphQLString,
            async resolve (parent) {
                let result = await funcEther.fetchSymbolAsync(parent);
                return result;
            }
        },
        totalSupply: {
            type: GraphQLString, 
            async resolve (parent) {
                let result = await funcEther.fetchTotalSupplyAsync(parent);
                return result;
            }
        },
        circulatingSupply: {
            type: GraphQLString,
            args: {
                HolderAddress: { type: GraphQLString },
            },
            async resolve(parent, { HolderAddress }) {
                let resultTotalSupply = await funcEther.fetchTotalSupplyAsync(parent);
                let resultBalanceOf = await funcEther.fetchBalanceOfAsync(parent, HolderAddress);
                let circulatingSupplyCal = resultTotalSupply - resultBalanceOf;
                return circulatingSupplyCal;
            }
        }
    }
});

const DecodedType = new GraphQLObjectType({
    name: 'Decoded',
    fields: {
        standard: { type: GraphQLString, resolve: (parent) => { return "ERC20"; } },
        entity: { type: GraphQLString, resolve: (parent) => { return "token"; } },
        contract: { type: ContractType, resolve: (parent) => { return parent.to; } },
        operation: {
            type: GraphQLString,
            resolve: (parent) => {
                let result = funcEther.fetchDecoder(parent.input);
                return result.name;
            }
        },
        from: { type: AddressType, resolve: (parent) => { return parent.from; } },
        to: {
            type: AddressType,
            resolve: (parent) => {
                let result = funcEther.fetchDecoder(parent.input);
                return result.params[0].value;
            }
        },
        value: {
            type: GraphQLString,
            resolve: (parent) => {
                let result = funcEther.fetchDecoder(parent.input);
                return funcEther.fetchFromWei(result.params[1].value);
            }
        }
    }
});

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
        status: {
            type: GraphQLString,
            async resolve(parent) {
                let result = await funcEther.fetchTransactionReceiptAsync(parent.hash);
                if (!result) {
                    return 'PENDING';
                }
                return result.status === undefined ? null : result.status ? 'SUCCESS' : 'FAILED';
            }
        },
        hash: { type: GraphQLString },
        from: { type: AddressType, resolve: (parent) => { return parent.from; } },
        to: { type: AddressType, resolve: (parent) => { return parent.to; } },
        value: { type: GraphQLString, resolve: (parent) => { return funcEther.fetchFromWei(parent.value); } },
        nonce: { type: GraphQLInt },
        gas: { type: GraphQLString },
        gasPrice: { type: GraphQLString },
        input: { type: GraphQLString },
        blockHash: { type: GraphQLString },
        blockNumber: { type: GraphQLString },
        transactionIndex: { type: GraphQLString },
        decoded: {
            type: DecodedType,
            resolve: (parent) => {
                if (!parent.input || parent.input === '0x') {
                    return null
                }
                let result = funcEther.fetchDecoder(parent.input);
                if (!result) {
                    return null
                }
                return parent;
            }
        }
    }
});

const BlockType = new GraphQLObjectType({
    name: 'Block',
    fields: {
        number: { type: GraphQLString },
        nonce: { type: GraphQLString },
        size: { type: GraphQLInt },
        gasLimit: { type: GraphQLInt },
        gasUsed: { type: GraphQLInt },
        hash: { type: GraphQLString },
        mixHash: { type: GraphQLString },
        parentHash: { type: GraphQLString },
        stateRoot: { type: GraphQLString },
        receiptsRoot: { type: GraphQLString },
        transactionsRoot: { type: GraphQLString },
        sha3Uncles: { type: GraphQLString },
        logsBloom: { type: GraphQLString },
        extraData: { type: GraphQLString },
        miner: { type: AddressType, resolve: (parent) => { return parent.miner; } },
        difficulty: { type: GraphQLString },
        totalDifficulty: { type: GraphQLString },
        timestamp: { type: GraphQLString },
        transactionCount: { type: GraphQLInt, resolve: (parent) => { return parent.transactions.length; } },
        transactions: {
            type: new GraphQLList(TransactionType),
            args: {
                WithInput: { type: GraphQLBoolean },
                ContractCreation: { type: GraphQLBoolean },
            },
            resolve: (parent, { WithInput, ContractCreation }) => {
                let Transactions = _.transform(parent.transactions, function (result, value) {
                    if (!WithInput)
                        value.input = null;
                    if (ContractCreation) {
                        if (value.to !== null)
                            value = null;
                    }
                    else {
                        if (value.to === null)
                            value = null;
                    }
                    result.push(value);
                    return result;
                }, []);
                return _.compact(Transactions);;
            }
        }
    }
});

const rootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        block: {
            type: BlockType,
            args: {
                BlockNumber: { type: GraphQLInt },
            },
            async resolve(parent, { BlockNumber }) {
                let result = await funcEther.fetchBlockAsync(BlockNumber);
                return result;
            }
        },
        blocksRange: {
            type: new GraphQLList(BlockType),
            args: {
                StartingBlock: { type: GraphQLInt },
                EndingBlock: { type: GraphQLInt },
            },
            async resolve(parent, { StartingBlock, EndingBlock }) {
                let blocksRangeCal = Array.from({ length: EndingBlock - StartingBlock + 1 }, (_, x) => x + StartingBlock);
                let blocksRangeResult = await Promise.all(blocksRangeCal.map(x => funcEther.fetchBlockAsync(x)));
                return blocksRangeResult;
            }
        },
        account: {
            type: AccountType,
            args: {
                Address: { type: GraphQLString }
            },
            async resolve(parent, { Address }) {
                return Address;
            }
        },
        transaction: {
            type: TransactionType,
            args: {
                Hash: { type: GraphQLString },
            },
            async resolve(parent, { Hash }) {
                let result = await funcEther.fetchTransactionAsync(Hash);
                return result;
            }
        },
        contract: {
            type: ContractType,
            args: {
                ContractAddress: { type: GraphQLString },
            },
            async resolve(parent, { ContractAddress }) {
                return ContractAddress;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQueryType
});

module.exports = schema;