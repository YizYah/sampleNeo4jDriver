import { mockSessionFromQuerySet, mockResultsFromCapturedOutput } from 'neo-forgery';

require('dotenv').config();
const test = require('ava');

import { cypherParams, movieOutput, movieParams, movieQuery, querySet } from './querySet';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { ApolloServer } from 'apollo-server-lambda';

const neo4j = require('neo4j-driver');

function mockDriver() {
    const driver = neo4j.driver(
        process.env.URI,
        neo4j.auth.basic(
            process.env.USER_NAME,
            process.env.PASSWORD,
        ),
        { disableLosslessIntegers: true }
    );
``
    driver.session = () => mockSessionFromQuerySet(querySet);
    driver.verifyConnectivity = () => Promise.resolve({});
    driver.supportsMultiDb = () => Promise.resolve(true);
    driver.supportsTransactionConfig = () => Promise.resolve(true);
    return driver;
}

const user = {
    'id': 'f5224bcb-12d7-48d3-8943-4fa862afa1ec',
    'roles': ['moderator'],
};

const typeDefs = `
type Person {
    name: String!
    born: Int
    actedInMovies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    directedMovies: [Movie!]! @relationship(type: "DIRECTED", direction: OUT)
}

type Movie {
    title: String!
    released: Int
    actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
}

type Query {
    getMovies (title: String!): [Movie] @cypher(statement: "match (movie:Movie {title:$title}) return movie")
}
`;

const schema = new Neo4jGraphQL({
    typeDefs,
}).schema;

const driver = mockDriver();

function context({ event, context }: { event: any, context: any }): any {
    return ({
        event,
        context,
        driver,
        user,
        cypherParams,
    });
}

const server = new ApolloServer(
    {
        schema,
        context,
        // cors: {
        //     origin: '*',
        //     methods: 'GET,HEAD,POST',
        // },
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

test('SSS [spoof simple server]', async (t: any) => {
    const result = await server.executeOperation({
        query: MOVIES,
        variables: movieParams,
    });
    console.log(`result=${JSON.stringify(result)}`);
    // console.log(`movieOutput.records=${JSON.stringify(movieOutput.records)}`);
    // console.log(`mockResultsFromCapturedOutput(movieOutput).records=${JSON.stringify(mockResultsFromCapturedOutput(movieOutput).records)}`);
    t.true(!result.errors);

    t.deepEqual(
        // @ts-ignore
        result.data.getMovies,
        mockResultsFromCapturedOutput(movieOutput)
            .records.map((record:any)=> record.get('movie').properties)
    );
});
