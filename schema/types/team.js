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
    const Player = require('./Player');
    const Owner = require('./Owner');

    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      city: { type: new GraphQLNonNull(GraphQLString) },
      fullName: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (obj) => `${obj.city} ${obj.name}`,
      },
      owners: {
        type: new GraphQLList(Owner),
        resolve: (team, args, { loaders }) =>
          loaders.getOwnersForTeams.load(team.id),
      },
      players: {
        type: new GraphQLList(Player),
        resolve: (team, args, { loaders }) =>
          loaders.getPlayersForTeams.load(team.id),
      },
    };
  },
});
