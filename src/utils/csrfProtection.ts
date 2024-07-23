import { doubleCsrf } from "csrf-csrf";
import { randomBytes } from "crypto";
import { Request, Response, NextFunction, RequestHandler } from "express";

const secret = randomBytes(32).toString();
const secure = process.env.NODE_ENV == "production" ? true : false;
const cookieName = process.env.NODE_ENV == "production" ? "__host-psifi.x-csrf-token" : "csrf-token";
const csrfProtection = doubleCsrf({
    getSecret: () => secret,
    cookieName: cookieName,
    cookieOptions: {
        sameSite: "lax",
        path: "/",
        secure: secure
    }
});

const IFoundCsrfProtectionMiddleware: RequestHandler =
    (req: Request, res: Response, next: NextFunction) => {
        // Some method to determine whether we want CSRF protection to apply
        if (req.path !== "/api/auth/getToken") {
            console.log("protect");
            // protect with CSRF
            csrfProtection.doubleCsrfProtection(req, res, next);
        } else {
            // Don't protect with CSRF
            next();
        }
    };
export { csrfProtection, IFoundCsrfProtectionMiddleware }

