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

const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: {
        hash: { type: GraphQLString },
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        value: { type: GraphQLFloat },
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
        transactions: {type: new GraphQLList(TransactionType) }
    }
});

const rootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
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
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQueryType
});

module.exports = schema;