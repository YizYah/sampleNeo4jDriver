import { mockSessionFromQuerySet, mockResultsFromCapturedOutput } from 'neo-forgery';

require('dotenv').config();
const test = require('ava');

import { cypherParams, movieOutput, movieParams, querySet } from './querySet';
import {APP_SPEC, APP_SPEC_VARS, expectedResultForAppSpec} from './appSpecQueryInfo'
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
type App {
    id: ID
    value: String
    #appSpecUserTypes: [UserType] @relationship(type: "Assn_app_to_userType_for_e36aa4c6-8029-4969-b1fe-d659bdb9eb42", direction: OUT) 
    #appSpecDescriptions: [Description] @relationship(type: "Assn_app_to_description_for_e36aa4c6-8029-4969-b1fe-d659bdb9eb42", direction: OUT)
}

type Person {
    name: String!
    born: Int
    #actedInMovies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    #directedMovies: [Movie!]! @relationship(type: "DIRECTED", direction: OUT)
}

type Movie {
    title: String!
    released: Int
    actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
}

type Query {
    getMovies (title: String!): [Movie] @cypher(statement: "match (movie:Movie {title:$title}) return movie")
    appSpec (customerId: ID!): [App] @cypher(statement: "match (customer:Customer {id:$customerId})-[:\`Assn_customer_to_app_for_e36aa4c6-8029-4969-b1fe-d659bdb9eb42\`]-(app:App) return app")
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

test.skip('SSS [spoof simple server]', async (t: any) => {
    const result = await server.executeOperation({
        query: MOVIES,
        variables: movieParams,
    });
    // console.log(`result=${JSON.stringify(result)}`);
    t.true(!result.errors);

    t.deepEqual(
        // @ts-ignore
        result.data.getMovies,
        mockResultsFromCapturedOutput(movieOutput)
            .records.map((record:any)=> record.get('movie').properties)
    );
});


test('AppSpec Query', async (t: any) => {
    const result = await server.executeOperation({
        query: APP_SPEC,
        variables: APP_SPEC_VARS,
    });
    t.true(!result.errors);

    t.deepEqual(
        // @ts-ignore
        result.data.appSpec,
        mockResultsFromCapturedOutput(expectedResultForAppSpec)
            .records.map((record:any)=> record.get('app').properties)
    );
});
