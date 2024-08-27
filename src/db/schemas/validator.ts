import { IFoundError } from "@codesRoot/middleware/errorType";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkSchema, Result, validationResult } from "express-validator";

function ContainsUpperLowerDigit(value: string) {
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
};
function isChinese(text: string) {
    return /^[\u4e00-\u9fa5]+$/.test(text);
};
function isFitlenghtRequire(value: string) {
    const length = value.length;
    if (isChinese(value) && length > 5) {
        return false
    }

    if (!isChinese(value) && length > 15) {
        return false
    }
    return true
}

function lenghtChecker(value: Array<string>) {
    for (const item of value) {
        if (!isFitlenghtRequire(item)) {
           return false 
        }
    }
    return true
}
const returnIfNotPass: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
    const result: Result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new IFoundError('Validation errors', 400, result.array()));
    }
    next()
}

const registerUserCheck = checkSchema({
    Account: {
        notEmpty: {
            errorMessage: "Account can't be empty."
        },
        isString: {
            errorMessage: "Account Must string."
        },
        isEmail: {
            errorMessage: "Account most a Email"
        },
        trim: true,
    },
    Password: {
        isString: {
            errorMessage: "Password Must string."
        },
        notEmpty: {
            errorMessage: "Password can't be empty."
        },
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

const uploadArticleCheck = checkSchema({
    Tags: {
        isArray: {
            errorMessage: "Tags Must a Array."
        },
        custom: {
            options: lenghtChecker,
            errorMessage: "single tag over length limit: Chinese: 5 word, English: 15 word."
        },
        trim: true,
        optional: true
    },
    Name: {
        isString: {
            errorMessage: "Name Must a String"
        },
        custom: {
            options: isFitlenghtRequire,
            errorMessage: "Name over length limit: Chinese: 5 word, English: 15 word."
        },
        notEmpty: {
            errorMessage: "Name Must fill."
        },
        trim: true
    },
    Description: {
        isString: {
            errorMessage: "Description Must a String"
        },
        optional: true
    },
    FoundLocation: {
        isString: {
            errorMessage: "FoundLocation Must a String"
        },
        optional: true
    
    },
    CurrentLocation: {
        isString: {
            errorMessage: "CurrentLocation Must a String"
        },
        notEmpty: {
            errorMessage: "CurrentLocation Must fill."
        }
    }

})

export { registerUserCheck, returnIfNotPass, uploadArticleCheck };
