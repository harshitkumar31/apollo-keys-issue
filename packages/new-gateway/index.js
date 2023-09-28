const { ApolloServer } =  require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose }= require("@apollo/gateway");
const {serializeQueryPlan} = require('@apollo/query-planner');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
        { name: "subgraphA", url: "http://localhost:4001/graphql" },
        { name: "subgraphB", url: "http://localhost:4002/graphql" }
    ],
  }),
  experimental_didResolveQueryPlan: function(options) {
    if (options.requestContext.operationName !== 'IntrospectionQuery') {
      console.log(serializeQueryPlan(options.queryPlan));
    }
  }
});

const server = new ApolloServer({ gateway });

const init = async() => {
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4050
        }
    });
    console.log(`🚀  Server ready at ${url}`);
}

init();
