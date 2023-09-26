# Start the subgraphs & gateways

Go to each directory in packages & run
```bash
npm run start
```

Execute the following Query:
```graphql
query tp {
  tpquery {
    tp {
      ...tpFields
    }
  }
}

fragment tpFields on TP {
  pg {
    ...pgFields
  }
}

fragment pgFields on TPPG {
  fieldA {
    ...CCAFragment
    ...DSAFragment
  }
}

fragment CCAFragment on CCA {
  canDeselect
  c1 {
    __typename
    id
    isDefault
  }
}

fragment DSAFragment on DSA {
  canDeselect
  c1 {
    __typename
    id
    isDefault
  }
}

```

Notice the difference in Query Plans

Old Gateway (`@apollo/gateway`: `0.28.3`)
```
QueryPlan {
  Sequence {
    Fetch(service: "subgraphA") {
      {
        tpquery {
          tp {
            pg {
              fieldA {
                __typename
                ... on CCA {
                  canDeselect
                  c1 {
                    __typename
                    id
                    _prefetch_
                  }
                }
                ... on DSA {
                  canDeselect
                  c1 {
                    __typename
                    id
                  }
                }
              }
            }
          }
        }
      }
    },
    Flatten(path: "tpquery.tp.pg.@.fieldA.@.c1") {
      Fetch(service: "subgraphB") {
        {
          ... on C1 {
            __typename
            id
            _prefetch_
          }
          ... on C2 {
            __typename
            id
          }
        } =>
        {
          ... on C1 {
            isDefault
          }
          ... on C2 {
            isDefault
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
  Sequence {
    Fetch(service: "subgraphA") {
      {
        tpquery {
          tp {
            pg {
              fieldA {
                __typename
                ... on CCA {
                  canDeselect
                  c1 {
                    __typename
                    id
                  }
                }
                ... on DSA {
                  canDeselect
                  c1 {
                    __typename
                    id
                  }
                }
              }
            }
          }
        }
      }
    },
    Flatten(path: "tpquery.tp.pg.@.fieldA.@.c1") {
      Fetch(service: "subgraphB") {
        {
          ... on C1 {
            __typename
            id
          }
          ... on C2 {
            __typename
            id
          }
        } =>
        {
          ... on C1 {
            isDefault
          }
          ... on C2 {
            isDefault
          }
        }
      },
    },
  },
}
```

Issue with the Query Plan : 

Call to subgraph A is not made with the key field "k2" and "field1" within type "E1" is never resolved.
