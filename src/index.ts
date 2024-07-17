import express, { Application, Response, Request } from "express";
import dotenv from "dotenv"
import morgan from "morgan"
import session from "express-session";
import { SetupSession } from "./auth/session_option";
import mongoose from "mongoose";
import { InitAdmin } from "./db/initUser";

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
    .catch((err) => console.error(`Error: ${err}`))

app.use(morgan('dev'));
app.use(express.json());
app.use(session(sessionOption))


console.log(`Server is Fire at http://localhost:${port}`);

app.listen(port, () => {
    console.log(`Start To listen port ${port}`);
})

//WARN:Debug for now please delete later.
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello This is IFoundApi, checkout /api To see the document.");
})
