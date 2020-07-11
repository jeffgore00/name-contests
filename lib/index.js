const express = require('express')
const graphqlHTTP = require('express-graphql');
const pg = require('pg');
const DataLoader = require('dataloader')

const schema = require('../schema');
const { nodeEnv } = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const pgConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pgConfig);
const dbQueries = require('../database/pgdb')(pgPool)

const app = express();


app.use('/graphql', (req, res) => {
  const loaders = {
    getPlayersForTeam: new DataLoader(dbQueries.getPlayersForTeam),
  };
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { pgPool, loaders }
  })(req, res);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
