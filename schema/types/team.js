const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const Player = require('./player');
const postgres = require('../../database/pgdb');

module.exports = new GraphQLObjectType({
  name: 'Team',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString, resolve: (obj) => obj.teamName },
    city: { type: new GraphQLNonNull(GraphQLString) },
    fullName: {
      type: GraphQLString,
      resolve: (obj) => `${obj.city} ${obj.teamName}`,
    },
    players: {
      type: new GraphQLList(Player),
      resolve: (team, args, { pgPool }) =>
        postgres(pgPool).getPlayersForTeam(team),
      /* Note here that `obj` is an instance of the given `Team`. */
    },
  },
});
