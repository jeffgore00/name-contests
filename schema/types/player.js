// Import type helpers from graphql-js
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');

const Person = require('../interfaces/Person')

module.exports = new GraphQLObjectType({
  name: 'Player',
  interfaces: [Person],
  fields: () => {
    const Team = require('./Team');
    const PlayerStatus = require('./PlayerStatus');

    return {
      id: { type: GraphQLID },
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      lastName: { type: new GraphQLNonNull(GraphQLString) },
      fullName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (obj) => `${obj.firstName} ${obj.lastName}`
      },
      jerseyNumber: { type: new GraphQLNonNull(GraphQLInt) },
      status: {
        type: new GraphQLNonNull(PlayerStatus),
        resolve: (obj) => obj.active,
      },
      team: {
        type: Team,
        resolve: (player, args, { loaders }) =>
          player.teamId && loaders.getTeamsByIds.load(player.teamId),
      },
      teamName: {
        type: GraphQLString,
        resolve: async (player, args, { loaders }) => {
          if (!player.teamId) return null;
          const team = await loaders.getTeamsByIds.load(player.teamId);
          return `${team.city} ${team.name}`;
        },
      },
    };
  },
});
