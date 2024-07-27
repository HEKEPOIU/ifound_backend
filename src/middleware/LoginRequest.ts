import { RequestHandler, NextFunction, Request, Response } from "express";
import { IFoundError } from "./errorType";
const RequestLogin: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new IFoundError("Not Login", 401, ["User Not Login"]))
    next();
}

export { RequestLogin }
