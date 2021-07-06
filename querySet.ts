import { QuerySpec } from 'neo-forgery';

// general server param constants
export const cypherParams = { 'currentUserId': 'f5224bcb-12d7-48d3-8943-4fa862afa1ec' };

export const auth = {
    'isAuthenticated': false,
    'roles': [],
};


// specific movie query info
export const movieQuery = 'match (movie:Movie {title:$title}) return movie'
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
                        "released": {
                            "low": 1994,
                            "high": 0
                        }
                    }
                }
            ],
            "_fieldLookup": {
                "movie": 0
            }
        },
    ]
}


export const querySet: QuerySpec[] = [
    {
        query: movieQuery,
        params: movieParams,
        output: movieOutput,
    }
]
