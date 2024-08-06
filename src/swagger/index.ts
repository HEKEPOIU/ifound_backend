import swaggerAutogen from "swagger-autogen"

const doc = {
    swagger: "3.0",
    info: {
        version: '0.0.1',            // by default: '1.0.0'
        title: 'IFound_API',              // by default: 'REST API'
    },
    host: "localhost:8000",
    servers: [
        {
            url: 'http://localhost:8000',              // by default: 'http://localhost:3000'
        },
        // { ... }
    ],
    tags: [
        {
            name: "Auth",
            description: "Authentication and Token"
        }
    ],
    definitions: {
        UserAuthData: {
            $Account: "Jhon Doe",
            $Password: "123456",
        },
        ValidationError: {
            $message: "Validation errors",
            $errors: [
                {
                    location: 'body',
                    msg: 'string',
                    param: 'string',
                    value: 'string'
                }
            ]

        },
        MongooseDuplicateKeyError: {
            $message: "MongoServerError",
            $errors: [
                "E11000 duplicate key error collection: test.users index: Account_1 dup key: { Account: \"example@email.com\" }"
            ]
        },
        UnknownError: {
            $message: "Unknown server error",
            $error: [
                "string"
            ]
        },
        LoginSuccess: {
            $Permision: 0
        },
        ForbiddenError: {
            $message: "ForbiddenError",
            $errors: [
                "invalid csrf token"
            ]
        },
        NotLoginError: {
            $message: "Not Login",
            $errors: [
                "User Not Login"
            ]
        }
    }
};

const outputFile = './doc/swagger.json'
const endpointsFiles = ["../index.ts"]
swaggerAutogen(outputFile, endpointsFiles, doc);
