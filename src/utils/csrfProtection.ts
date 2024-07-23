import { csrfSync } from "csrf-sync";
import { NextFunction, Request, RequestHandler, Response } from "express";

const csrfProtection = csrfSync();
const csrfNeedList: Array<string> =
    [
        "/api/auth/logout",
    ]

const IFoundCsrfProtectionMiddleware: RequestHandler =
    (req: Request, res: Response, next: NextFunction) => {
        // Some method to determine whether we want CSRF protection to apply
        if (isCsrfProtectionNeeded(req)) {
            // protect with CSRF
            csrfProtection.csrfSynchronisedProtection(req, res, next);
        } else {
            // Don't protect with CSRF
            next();
        }
    };
function isCsrfProtectionNeeded(req: Request): boolean {
    return csrfNeedList.includes(req.path);
}
export { csrfProtection, IFoundCsrfProtectionMiddleware }
