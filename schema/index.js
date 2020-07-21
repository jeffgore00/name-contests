// Import type helpers from graphql-js
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require('graphql');

const postgres = require('../database/pgdb');
const Team = require('./types/Team');
const Player = require('./types/Player');
const AddTeam = require('./mutations/addTeam')
const SearchResult = require('./unions/Search')

const teams = {
  type: new GraphQLList(Team),
  description: 'All the teams.',
  args: {
    teamName: {
      type: GraphQLString,
    },
  },
  resolve: (player, args, { pgPool }) => {
    if (args.teamName) {
      return postgres(pgPool).getTeamsByName(args.teamName);
    } else {
      return postgres(pgPool).getTeams();
    }
  },
};

const players = {
  type: new GraphQLList(Player),
  description: 'All the players.',
  args: {
    playerName: {
      type: GraphQLString,
    },
  },
  resolve: (player, args, { pgPool }) => {
    if (args.playerName) {
      return postgres(pgPool).getPlayersByName(args.playerName);
    } else {
      return postgres(pgPool).getPlayers();
    }
  },
};

const search = {
  type: new GraphQLList(SearchResult),
  description: 'A search result.',
  args: {
    contains: {
      type: GraphQLString,
    },
  },
  resolve: (obj, args, { pgPool }) => {
    return postgres(pgPool).search(args.contains);
  },
}

// The root query type is where in the data graph
// we can start asking questions
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    teams,
    players,
    search
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({
    addTeam: AddTeam
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = schema;
