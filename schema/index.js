// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList
} = require('graphql');

const postgres = require('../database/pgdb');
const Team = require('./types/team');

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    teams: {
      type: new GraphQLList(Team),
      description: 'All the teams.',
      resolve: (obj, args, { pgPool }) => {
        console.log('JG IN HERE')
        return postgres(pgPool).getTeams().catch(err => {
          console.log('JG ERR', err)
        });
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType
  // mutation: ...
});

module.exports = ncSchema;
