const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildFederatedSchema } = require('@apollo/federation');
const gql = require('graphql-tag');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type Foo @key(fields: "id id2") @key(fields: "id") {
    id: ID!
    id2: ID!
    helloFromB: String
  }

`;

const resolvers = {};

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
