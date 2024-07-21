import session, { SessionOptions } from "express-session";
import { randomBytes } from "crypto";
import { Application } from "express";

interface IFoundSessionOption extends SessionOptions {
    cookie: session.CookieOptions,
}

/**
 * Setup SessionOption base on NODE_ENV
 * @param app express Application, we use app.get('env') to check NODE_ENV state.
 */
function SetupSession(app: Application): IFoundSessionOption {
    //RandomGenrate the Secret for Session.
    //32 bytes is because official said:
    //Note HMAC-256 is used to sign the session ID. For this reason, the secret should contain at least 32 bytes of entropy.
    const secret = randomBytes(32).toString();
    const sessionOption: IFoundSessionOption = {
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            sameSite: 'lax' // it is Chrome 80 after default value.
        }
    }

    //NOTE:
    // app.get('env') == process.env.NODE_ENV,
    // but if NODE_ENV == undefined => app.get('env') == development;
    // http://expressjs.com/en/5x/api.html#app.set official doc.
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1);
        sessionOption.cookie.secure = true;
    }
    return sessionOption;
}
export { SetupSession };
