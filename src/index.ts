import express, { Application } from "express";
import dotenv from "dotenv"
import morgan from "morgan"
import session from "express-session";
import { SetupSession } from "./session_option";
import mongoose from "mongoose";
import { InitAdmin } from "./db/initUser";
import { router } from "./route";
import passport from "passport"
import swaggerUi from "swagger-ui-express"
import swaggerFile from "./swagger/doc/swagger.json"
import { IFoundErrorHandle } from "./middleware/errorHandle";
import { IFoundCsrfProtectionMiddleware } from "./utils/csrfProtection";

dotenv.config();
const app: Application = express();
const port = process.env.PORT;

const sessionOption = SetupSession(app);
mongoose.connect(process.env.MONDOURI)
    .then(async () => {
        console.log('Connected to Database')
        console.log('Try to Init Admin');
        await InitAdmin(process.env.ADMINNAME, process.env.ADMINPASSWORD);
        console.log('Init successful.')
    })
    .catch((err) => console.error(`Error: ${err}`));



app.use(morgan('dev'));
app.use(express.json());
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(IFoundCsrfProtectionMiddleware);
app.use("/api", router);
app.use(IFoundErrorHandle);

console.log(`Server is Fire at http://localhost:${port}`);

app.listen(port, async () => {
    console.log(`Start To listen port ${port}`);
    if (process.env.NODE_ENV == "development") {
        app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    }
})

