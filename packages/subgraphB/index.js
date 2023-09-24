const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildFederatedSchema } = require('@apollo/federation');
const gql = require('graphql-tag');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
scalar JSON

extend type E1 @key(fields: "id k2") {
    id: ID! @external
    k2: JSON @external
    needsBoolean: Boolean! @external
  }

  interface Interface1 {
   
    field2: String!
  
  }

  type Impl1 implements Interface1 {
    field2: String!
    implField1: String
    e1: E1! @provides(fields: "needsBoolean")
  }

  type Impl2 implements Interface1 {
    field2: String!
    implField2: String
    e1: E1!
  }

  union  Union1 = Impl1 | Impl2

  type O1 {
    field1: String
    impl1: Union1
  }
  
  type Query {
    getE2: O1
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