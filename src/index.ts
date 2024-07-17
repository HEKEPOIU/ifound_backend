import express, { Application, Response, Request } from "express";
import dotenv from "dotenv"
import morgan from "morgan"
import session from "express-session";
import { IFoundSessionOption } from "./auth/session_option";
import { randomBytes } from "crypto";

dotenv.config();
const app: Application = express();
const port = process.env.PORT;

//RandomGenrate the Secret for Session.
//32 bytes is because official said:
//Note HMAC-256 is used to sign the session ID. For this reason, the secret should contain at least 32 bytes of entropy.
const secret = randomBytes(32).toString();
const sess: IFoundSessionOption = {
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax' // it is Chrome 80 after default value.
    }
}

// app.get('env') == process.env.NODE_ENV,
// but if NODE_ENV == undefined => app.get('env') == development;
// http://expressjs.com/en/5x/api.html#app.set official doc.
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}


app.use(morgan('dev'));
app.use(express.json());
app.use(session(sess))


console.log(`Server is Fire at http://localhost:${port}`);

app.listen(port, () => {
    console.log(`Start To listen port ${port}`);
})

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello This is IFoundApi, checkout /api To see the document.");
})
