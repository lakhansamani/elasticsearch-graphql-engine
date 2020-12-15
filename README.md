# Elasticsearch GraphQL Engine

Takes any Elasticsearch cluster as its source and provides with graphql url which can be used to query the elasticsearch in native graphql manner.

## How it works?

`elasticsearch-graphql-engine` takes ELASTICSEARCH_URL as its environment variable and builds the graphql schema to query based on the mappings available for each indices

Example if you have `users` index in your Elasticsearch with some JSON data, then it will convert that to a schema which will allow you to query and get the exact required fields

    users {
        total
        hits {
            _id
            firstName
            lastName
            age
        }
    }

### Search Query Example

    users(query: "bob", fields: ["firstName", "firstName.search"]) {
        total
        hits {
            _id
            firstName
            lastName
            email
            age
        }
    }

## Quick start

- Clone the repository `git clone https://github.com/lakhansamani/elasticsearch-graphql-engine.git`
- Install dependencies `yarn` or `npm install`
- Configure the environment variables
  ```
    echo "ELASTICSEARCH_URL=YOUR_ES_URL" > .env
  ```
- Start in development mode `yarn develop`

- Build for production `yarn build`
- Start in production mode `yarn start`
- Open `localhost:8000/graphql` to get the Graphql Playground

## V1 Roadmap

- [ ] Define the Elasticsearch types for Graphql
- [x] Generate Schema out of mappings for existing Elasticsearch Cluster
- [x] Add support for search query
- [ ] Add support for aggregation query
- [ ] Add testing for schema generation
- [ ] Add testing for query resolvers
- [ ] Add documentation on getting started

## V2 Roadmap

- [ ] Add mutation for the index
