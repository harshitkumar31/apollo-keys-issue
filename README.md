# Start the subgraphs & gateways

Go to each directory in packages & run
```bash
npm run start
```

Execute the following Query:
```graphql
query ExampleQuery {
  getE2 {
    ...implFragment
    
  }

}
fragment implFragment on O1 {
impl1 {
      
      ... on Impl2 {
        field2
      }
      ... on Impl1 {
        field2
        implField1
        e1 {
          id
          __typename
needsBoolean
        }
      
    }
    }
}
```

Notice the difference in Query Plans

Old Gateway (`@apollo/gateway`: `0.28.3`)
```
QueryPlan {
  Sequence {
    Fetch(service: "subgraphB") {
      {
        getE2 {
          impl1 {
            __typename
            ... on Impl2 {
              field2
            }
            ... on Impl1 {
              field2
              implField1
              e1 {
                id
                __typename
                needsBoolean
                k2
              }
            }
          }
        }
      }
    },
    Flatten(path: "getE2.impl1.e1") {
      Fetch(service: "subgraphA") {
        {
          ... on E1 {
            __typename
            id
            k2
          }
        } =>
        {
          ... on E1 {
            field1
          }
        }
      },
    },
  },
}
```

New Gateway (`@apollo/gateway`: `2.5.4`)
```
QueryPlan {
  Fetch(service: "subgraphB") {
    {
      getE2 {
        impl1 {
          __typename
          ... on Impl2 {
            field2
          }
          ... on Impl1 {
            field2
            implField1
            e1 {
              __typename
              id
              needsBoolean
            }
          }
        }
      }
    }
  },
}
```

Issue with the Query Plan : 

Call to subgraph A is not made with the key field "k2"