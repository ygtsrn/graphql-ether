require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./Schema/schema');

const app = express();

app.set('port', (process.env.PORT || 4000));

app.use('/GraphQlEther', graphqlHTTP({
    schema: schema,
    graphiql: true
    // graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(app.get('port'), () => {
    console.log('Listening on port : ' + app.get('port') + ' System status : ' + process.env.NODE_ENV);
});