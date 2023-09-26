const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildFederatedSchema } = require('@apollo/federation');
const gql = require('graphql-tag');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
scalar JSON



  type O1 {
    field1: String
  }
  
  type Query {
    getE2: O1
  }

  interface EBase {
    id: ID!
    field1: String
}

type C2 implements EBase @key(fields: "id"){
  id: ID!
  field1: String
  isDefault: Boolean
}

type C1 implements EBase @key(fields: "id _prefetch_") @key(fields: "id"){
  id: ID!
  _prefetch_: JSON
  field1: String
  isDefault: Boolean
}
  
`;

const resolvers = {
    Query: {
        getE2: () => ({
          __typename: 'E1',
          k2: {
            "title": "For testing"
          }
        }),
    },
  };

const server = new ApolloServer({
    schema: buildFederatedSchema({ typeDefs, resolvers }),
  });
  
  const init = async () => {
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
};

init();