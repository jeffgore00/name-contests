const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const pgdb = require('../../database/pgdb');
const Team = require('../types/Team');

const TeamInput = new GraphQLInputObjectType({
  name: 'TeamInput',

  fields: {
    city: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) }
  }
});

module.exports = {
  type: Team,
  name: 'addTeam',
  args: {
    input: { type: new GraphQLNonNull(TeamInput) }
  },
  resolve(obj, { input }, { pgPool }) {
    return pgdb(pgPool).addTeam(input)
  }
};
