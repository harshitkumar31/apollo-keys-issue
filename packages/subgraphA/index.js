const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildFederatedSchema } = require('@apollo/federation');
const gql = require('graphql-tag');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
scalar JSON

type Query {
  getE1: E1
}

interface EBase {
    id: ID!
    field1: String
}

type E1 implements EBase @key(fields: "id k2") {
id: ID!
  k2: JSON
  field1: String
  needsBoolean: Boolean!
}
`;

const resolvers = {
    Query: {
        getE1: () => [{
            k1: "2",
            k2: {
                "title": "sample"
            }
        }],
    },
    E1: {
        __resolveReference: () => {
            return {
                k1: "123",
                k2: {},
                field1: "message"
            }
        }
    }
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
    listen: { port: 4001 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
};

init();