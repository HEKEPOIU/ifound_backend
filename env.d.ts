declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            NODE_ENV: string;
            MONGOUSERNAME: string;
            MONGOPASSWORD: string;
            MONDOURI: string;
            ADMINNAME: string;
            ADMINPASSWORD: string;
            //You Can add more .env setting in it.
        }
    }
}


//need This to let typescript know this is module
//Reference: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript
export { }
