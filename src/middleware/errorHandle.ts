import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { IFoundError } from "./errorType";

const IFoundErrorHandle: ErrorRequestHandler =
    (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof IFoundError) {
            return res.status(err.statusCode).json({ message: err.message, errors: err.errors })
        }

        if (err instanceof Error) {
            if (err.name == "MongoServerError") {
                return res.status(409).json({ message: err.name, errors: [err.message] })
            }
        }
        // console.log(err);
        if (err.name === "ForbiddenError") {
            return res.status(403).json({ message: err.name, errors: [err.message] });
        }

        return res.status(500).json({ message: "Unknown server error", errors: [err.message] });
    }



export { IFoundErrorHandle }
