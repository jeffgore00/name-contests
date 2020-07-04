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
    name: { type: GraphQLString, resolve: obj => obj.teamName },
    city: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: GraphQLString, resolve: obj => `${obj.city} ${obj.teamName}`},
    players: {
      type: new GraphQLList(Player),
      async resolve(obj, args, { pgPool }) {
        /* Note here that `obj` is an instance of the given `Team`. */
        try {
          const players = await postgres(pgPool).getPlayersForTeam(obj);
          return players;
        } catch (err) {
          console.log('WTF ', err);
        }
      },
    },
  },
});
