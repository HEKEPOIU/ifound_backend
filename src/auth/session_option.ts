import session, { SessionOptions } from "express-session";

interface IFoundSessionOption extends SessionOptions {
    cookie: session.CookieOptions,
}

export { IFoundSessionOption };
