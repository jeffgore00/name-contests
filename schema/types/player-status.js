const {
  GraphQLEnumType,
} = require('graphql');

module.exports = new GraphQLEnumType({
  name: 'PlayerStatus',
  values: {
    ACTIVE: { value: true },
    INACTIVE: { value: false }
  }
})
