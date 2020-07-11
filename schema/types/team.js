const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const Player = require('./player');

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
      resolve: async (team, args, { loaders }) => {
        console.log('TRYNA LOAD WITH ', JSON.stringify(team))
        try {
        const result = await loaders.getPlayersForTeam.load(team.id);
        console.log('RSESS', result)
        return result
        } catch (e) {
          console.log('ORR', e)
        }
      }
      /* Note here that `obj` is an instance of the given `Team`. */
    },
  },
});
