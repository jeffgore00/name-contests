const {
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');


module.exports = new GraphQLInterfaceType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: new GraphQLNonNull(GraphQLString) }
  }
})
