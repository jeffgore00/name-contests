// Import type helpers from graphql-js
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Player',
  fields: () => {
    const Team = require('./team');
    const PlayerStatus = require('./player-status');

    return {
      id: { type: GraphQLID },
      fullName: { type: new GraphQLNonNull(GraphQLString) },
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
