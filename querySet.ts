import {QuerySpec} from "neo-forgery";

export const movieQuery = 'match (movie:Movie {title:$title}) return movie'
export const movieParams = {
    title: "Forrest Gump"
}
const expectedOutput = {
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
        output: expectedOutput,
    }
]
