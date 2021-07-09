export const APP_SPEC = `
query AppSpec($customerId: ID!) {
  appSpec(customerId: $customerId){
    id
    value
  }
}
`


export const appSpecQuery = `
WITH apoc.cypher.runFirstColumn("match (customer:Customer {id:$customerId})-[:\`Assn_customer_to_app_for_e36aa4c6-8029-4969-b1fe-d659bdb9eb42\`]-(app:App) return app", {auth: $auth, cypherParams: $cypherParams, customerId: $customerId}, true) as x
                UNWIND x as this
            
RETURN this { .id, .value } AS this`


export const APP_SPEC_VARS = {
  customerId: 'f5224bcb-12d7-48d3-8943-4fa862afa1ec',
  auth: {
    isAuthenticated: false,
    roles: [],
  },
  cypherParams: {
    currentUserId: 'f5224bcb-12d7-48d3-8943-4fa862afa1ec',
  },
}

export const dataResultForAppSpec = [
  {
    id: '283bc67c-b1b9-4a57-9377-6823f39b8b5b',
    value: 'Sample for Yisroel',
  }, {
    id: 'eca6861f-6f9f-4ba1-bee6-3a7904956325',
    value: 'Sample for Yisroel',
  }, {
    id: '7603d148-cf5d-4d8c-a6b2-f4dad4c3f69e',
    value: 'Sample for Yisroel',
  }, {
    id: 'b8aa9e8b-070b-494d-8953-7da50d4da8f8',
    value: 'Sample for Yisroel',
  },
]


export const expectedResultForAppSpec = {
  records: [
    {
      "keys": [
        "app"
      ],
      "length": 1,
      "_fields": [
        {
          "identity": {
            "low": 4499,
            "high": 0
          },
          "labels": [
            "App",
            "Exported"
          ],
          "properties": {
            "value": "Sample for Yisroel",
            "id": "283bc67c-b1b9-4a57-9377-6823f39b8b5b"
          }
        }
      ],
      "_fieldLookup": {
        "app": 0
      }
    },
    {
      "keys": [
        "app"
      ],
      "length": 1,
      "_fields": [
        {
          "identity": {
            "low": 4497,
            "high": 0
          },
          "labels": [
            "App",
            "Exported"
          ],
          "properties": {
            "value": "Sample for Yisroel",
            "id": "eca6861f-6f9f-4ba1-bee6-3a7904956325"
          }
        }
      ],
      "_fieldLookup": {
        "app": 0
      }
    },
    {
      "keys": [
        "app"
      ],
      "length": 1,
      "_fields": [
        {
          "identity": {
            "low": 4496,
            "high": 0
          },
          "labels": [
            "App",
            "Exported"
          ],
          "properties": {
            "id": "7603d148-cf5d-4d8c-a6b2-f4dad4c3f69e",
            "value": "Sample for Yisroel"
          }
        }
      ],
      "_fieldLookup": {
        "app": 0
      }
    },
    {
      "keys": [
        "app"
      ],
      "length": 1,
      "_fields": [
        {
          "identity": {
            "low": 4498,
            "high": 0
          },
          "labels": [
            "App",
            "Exported"
          ],
          "properties": {
            "value": "Sample for Yisroel",
            "id": "b8aa9e8b-070b-494d-8953-7da50d4da8f8"
          }
        }
      ],
      "_fieldLookup": {
        "app": 0
      }
    }
  ]
}
