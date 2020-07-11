// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList
} = require('graphql');

const postgres = require('../database/pgdb');
const Team = require('./types/team');
const Player = require('./types/player');


const teams = {
  type: new GraphQLList(Team),
  description: 'All the teams.',
  resolve: (obj, args, { pgPool }) => postgres(pgPool).getTeams()
}

const players = {
  type: new GraphQLList(Player),
  description: 'All the players.',
  resolve: (obj, args, { pgPool }) => postgres(pgPool).getPlayers()
}

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    teams,
    players
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType
  // mutation: ...
});

module.exports = schema;
