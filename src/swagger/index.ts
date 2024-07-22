import swaggerAutogen from "swagger-autogen"

const doc = {
    swagger: "3.0",
    info: {
        version: '0.0.1',            // by default: '1.0.0'
        title: 'IFound_API',              // by default: 'REST API'
    },
    servers: [
        {
            url: 'http://localhost:3000',              // by default: 'http://localhost:3000'
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
        }
    }
};

const outputFile = './doc/swagger.json'
const endpointsFiles = ["../route/index.ts"]
swaggerAutogen(outputFile, endpointsFiles, doc);
