import {mockResultsFromData, QuerySpec} from 'neo-forgery';

import { appSpecQuery, APP_SPEC_VARS, expectedResultForAppSpec } from './appSpecQueryInfo'

// general server param constants
export const cypherParams = { 'currentUserId': 'f5224bcb-12d7-48d3-8943-4fa862afa1ec' };

export const auth = {
    'isAuthenticated': false,
    'roles': [],
};


// specific movie query info

export const movieQuery = `
WITH apoc.cypher.runFirstColumn("match (movie:Movie {title:$title}) return movie", {auth: $auth, cypherParams: $cypherParams, title: $title}, true) as x
                UNWIND x as this
            
RETURN this { .title, .released } AS this`

export const movieParams = {
    title: "Forrest Gump",
    auth,
    cypherParams,
}
export const movieOutput = {
    records: [
        {
            "keys": [
                "movie"
            ],
            "length": 1,
            "_fields": [
                {
                    "identity": {
                        "low": 32,
                        "high": 0
                    },
                    "labels": [
                        "Movie"
                    ],
                    "properties": {
                        "title": "Forrest Gump",
                        "released": 1994
                    }
                }
            ],
            "_fieldLookup": {
                "movie": 0
            }
        },
    ]
}

console.log(`expectedResultForAppSpec = 
${JSON.stringify(expectedResultForAppSpec,null,2)}`)

export const querySet: QuerySpec[] = [
    {
        query: movieQuery,
        params: movieParams,
        output: movieOutput,
    },
    {
        name: 'appSpec',
        query: appSpecQuery,
        output: expectedResultForAppSpec,
        params: APP_SPEC_VARS,
    },

]
