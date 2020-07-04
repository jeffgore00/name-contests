// Import type helpers from graphql-js
const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const PlayerStatus = require('./player-status')

module.exports = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: { type: GraphQLID },
    fullName: { type: new GraphQLNonNull(GraphQLString) },
    jerseyNumber: { type: new GraphQLNonNull(GraphQLInt) },
    status: { type: new GraphQLNonNull(PlayerStatus), resolve: obj => obj.active }
  }
})
