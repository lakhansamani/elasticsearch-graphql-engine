# Elasticsearch GraphQL Engine

Takes any Elasticsearch cluster as its source and provides with graphql url which can be used to query the elasticsearch in native graphql manner.

## V1 Roadmap

- [ ] Define the Elasticsearch types for Graphql
- [x] Generate Schema out of mappings for existing Elasticsearch Cluster
- [x] Add support for search query
- [ ] Add support for aggregation query
- [ ] Add testing for schema generation
- [ ] Add testing for query resolvers
- [ ] Add documentation on getting started

## Quick start

- Install dependencies `yarn` or `npm install`
- Start in deveploment mode `yarn develop`
- Build for production `yarn build`
- Start in production mode `yarn start`
