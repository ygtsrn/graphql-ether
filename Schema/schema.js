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

const AccountType = new GraphQLObjectType({
    name: 'Account',
    fields: {
        balance: { 
            type: GraphQLFloat,
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

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
        hash: { type: GraphQLString },
        from: { type: AddressType, resolve: (parent) => { return parent.from; } },
        to: { type: AddressType, resolve: (parent) => { return parent.to; } },
        value: { type: GraphQLFloat, resolve: (parent) => { return funcEther.fetchFromWei(parent.value); } },
        nonce: { type: GraphQLInt },
        gas: { type: GraphQLString },
        gasPrice: { type: GraphQLString },
        input: { type: GraphQLString },
        blockHash: { type: GraphQLString },
        blockNumber: { type: GraphQLString },
        transactionIndex: { type: GraphQLString }
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
        miner: { type: GraphQLString },
        difficulty: { type: GraphQLString },
        totalDifficulty: { type: GraphQLString },
        timestamp: { type: GraphQLString },
        transactions: {
            type: new GraphQLList(TransactionType),
            args: {
                WithInput: { type: GraphQLBoolean },
                ContractCreation: { type: GraphQLBoolean },
            },
            resolve: (parent, { WithInput, ContractCreation }) => {
                // let Transactions = [];
                // _.transform(parent.transactions, function(result, value, key) {
                //     if (!WithInput) {
                //         value.input = null;
                //         result[key] = value;
                //     }
                //     Transactions = result;
                // });
                // console.log(Transactions);
                return parent.transactions;
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
                const result = await funcEther.fetchBlockAsync(BlockNumber);
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
                const blocksRangeCal = Array.from({ length: EndingBlock - StartingBlock + 1 }, (_, x) => x + StartingBlock);
                let blocksRangeResult = await Promise.all(blocksRangeCal.map(x => funcEther.fetchBlockAsync(x)));
                return blocksRangeResult;
            }
        },
        account: {
            type: AccountType,
            args: {
                Address: { type: GraphQLString },
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
                const result = await funcEther.fetchTransactionAsync(Hash);
                return result;
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQueryType
});

module.exports = schema;


// transaction: {},
//         account: {},
//         contract: {}