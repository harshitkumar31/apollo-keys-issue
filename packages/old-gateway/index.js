const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const {serializeQueryPlan} = require('@apollo/query-planner');

const gateway = new ApolloGateway({
  serviceList: [
    { name: "subgraphA", url: "http://localhost:4001/graphql" },
    { name: "subgraphB", url: "http://localhost:4002/graphql" },
    
  ],
  experimental_didResolveQueryPlan: function(options) {
    if (options.requestContext.operationName !== 'IntrospectionQuery') {
      console.log(serializeQueryPlan(options.queryPlan));
    }
  }
});

const server = new ApolloServer({ gateway,subscriptions: false });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});