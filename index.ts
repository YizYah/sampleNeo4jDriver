require('dotenv').config()
import {querySet, movieQuery, movieParams} from "./querySet";

const neo4j = require('neo4j-driver')

import {Neo4jGraphQL} from '@neo4j/graphql'
import {mockSessionFromQuerySet} from 'neo-forgery'
import {ApolloServer} from 'apollo-server'

function mockDriver() {
    const driver = neo4j.driver(
        process.env.DB_URI,
        neo4j.auth.basic(
            process.env.DB_USER,
            process.env.DB_PASSWORD,
        ),
    )

    driver.session = () => mockSessionFromQuerySet(querySet)
    driver.verifyConnectivity = () => Promise.resolve({});
    driver.supportsMultiDb = () => Promise.resolve(true);
    driver.supportsTransactionConfig = () => Promise.resolve(true);
    return driver
}

// Create a context
const cypherParams = {"currentUserId": "f5224bcb-12d7-48d3-8943-4fa862afa1ec"}
const user = {
    "id": "f5224bcb-12d7-48d3-8943-4fa862afa1ec",
    "roles": ["moderator"]
}


const typeDefs = `
type Movie {
    title: String!
    released: Int
}

type Query {
    getMovies (title: String!): [Movie] @cypher(statement: "${movieQuery}")
}
`;
console.log(`typesDefs=${typeDefs}`)

const schema = new Neo4jGraphQL({
    typeDefs,
}).schema

const driver = mockDriver()

function context({event, context} : { event: any, context: any }): any {
    return ({
        event,
        context,
        driver,
        user,
        cypherParams,
    })
}

const server = new ApolloServer(
    {
        schema,
        context,
        cors: {
            origin: '*',
            methods: 'GET,HEAD,POST',
        },
        introspection: true,
    });

const MOVIES = `
query GetMovies($title: String!){
  getMovies(title: $title){
   title
   released
  }
}
`;

(async () => {
    const result = await server.executeOperation({
        query: MOVIES,
        variables: movieParams,
    });
    console.log(`result=${JSON.stringify(result)}`)
})()
