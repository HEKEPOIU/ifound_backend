import { IFoundError } from "@codesRoot/middleware/errorType";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkSchema, Result, validationResult } from "express-validator";

function ContainsUpperLowerDigit(value: string) {
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
};
const returnIfNotPass: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new IFoundError('Validation errors', 400, result.array()));
    }
    next()
}

const registerUserCheck = checkSchema({
    Account: {
        notEmpty: true,
        isEmail: {
            errorMessage: "Account most a Email"
        },
        trim: true,
    },
    Password: {
        isLength: {
            options: { min: 10, max: 15 },
            errorMessage: "Password length must more then 10."
        },
        custom: {
            options: ContainsUpperLowerDigit,
            errorMessage: "Password must mix Upper/Lower case and Digit."
        },
        trim: true,
    }
});

export { registerUserCheck, returnIfNotPass };
