const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Team',
  fields: () => {
    const Player = require('./player');
    const Owner = require('./owner');

    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString, resolve: (obj) => obj.teamName },
      city: { type: new GraphQLNonNull(GraphQLString) },
      fullName: {
        type: GraphQLString,
        resolve: (obj) => `${obj.city} ${obj.teamName}`,
      },
      owner: {
        type: Owner,
        resolve: (team, args, { loaders }) =>
          loaders.getOwnerForTeams.load(team.id),
      },
      players: {
        type: new GraphQLList(Player),
        resolve: (team, args, { loaders }) =>
          loaders.getPlayersForTeams.load(team.id),
      },
    };
  },
});
