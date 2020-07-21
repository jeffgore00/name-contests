const { GraphQLUnionType } = require('graphql');
const Player = require('../types/Player')
const Team = require('../types/Team')

module.exports = new GraphQLUnionType({
  name: 'SearchResult',
  types: [ Player, Team ],
  resolveType(value) {
    if (value.firstName) {
      return Player;
    }
    if (value.name) {
      return Team;
    }
  }
});
