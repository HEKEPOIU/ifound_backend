import { NextFunction, Request, Response, Router } from "express";
import { registerUserCheck } from "@codesRoot/db/schemas/userValidator";
import { matchedData, Result, validationResult } from "express-validator";
import { UserModel } from "@codesRoot/db/schemas/user";
import { HashPassword } from "@codesRoot/utils/helper";
import passport from "passport";
import { UserDocument } from "@codesRoot/db/schemas/userType";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { IFoundError } from "@codesRoot/middleware/errorType";
import { csrfProtection } from "@codesRoot/utils/csrfProtection";

const authRouter = Router()


authRouter.post("/register", registerUserCheck, async (req: Request, res: Response, next: NextFunction) => {


    /*  
        #swagger.description = 'Endpoint to register a new user.'

        #swagger.parameters['UserAuthData'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: {  $ref: "#/definitions/UserAuthData" }
        }

        #swagger.responses[201] = {
            description: 'User created successfully.',
            schema: { message: 'User created' }
        }

        #swagger.responses[400] = {
            description: 'Validation errors.',
            schema: { $ref: "#/definitions/ValidationError" }
        }

        #swagger.responses[409] = {
            description: 'Conflict error, likely due to a duplicate user.',
            schema: {  $ref: "#/definitions/MongooseDuplicateKeyError" }
        }

        #swagger.responses[500] = {
            description: 'Unknown server error.',
            schema: {  $ref: "#/definitions/UnknownError"  }
        }
    */
    const result: Result = validationResult(req);
    if (!result.isEmpty()) {
        return next(new IFoundError('Validation errors', 400, result.array()));
    }

    const data = matchedData(req);
    data.Password = await HashPassword(data.Password);

    const newUser = new UserModel({ ...data, Permission: 0 });
    try {
        await newUser.save();
        return res.status(201).json({ message: "User created" })
    } catch (err) {
        if (err instanceof Error) {
            if (err.name == "MongoServerError") {
                return next(new IFoundError(err.name, 409, [err.message]));
            }
        }

        return next(err);
    }
})
authRouter.post(
    "/login",
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        /*  
            #swagger.description = 'Endpoint to log in a user.'
            #swagger.parameters['UserAuthData'] = {
                in: 'body',
                description: 'User information.',
                required: true,
                schema: {  $ref: "#/definitions/UserAuthData" }
            }
 
            #swagger.responses[200] = {
                description: 'User logged in successfully.',
                schema: { $ref: "#/definitions/LoginSuccess" }
            }

            #swagger.responses[401] = {
                description: 'Unauthorized, login failed.',
                schema: { message: 'Unauthorized' }
            }
        */
        const user = req.user as UserDocument;
        res.status(200).json({ csrfToken: csrfProtection.generateToken(req), Permission: user.Permission });
    }
)
// Why delete? See the doc:
// https://www.passportjs.org/concepts/authentication/logout/
authRouter.delete("/logout",
    csrfProtection.csrfSynchronisedProtection,
    (req: Request, res: Response, next: NextFunction) => {
        /*  
            #swagger.description = 'Endpoint to log out a user.'
    
            #swagger.responses[205] = {
                description: 'User logged out successfully.'
            }
    
            #swagger.responses[500] = {
                description: 'Unknown server error.',
                schema: {$ref: "#/definitions/UnknownError" }
            }
    
            #swagger.responses[403] = {
                description: 'ForbiddenError: invalid csrf token',
                schema: { $ref: "#/definitions/ForbiddenError" }
            }
        */
        res.clearCookie('connect.sid');  // clear the cookie
        req.logout((err) => {
            if (err) return next(err);
            req.session.destroy(() => {
                res.sendStatus(205);
            })
        });
    })

authRouter.get("/getToken", RequestLogin,
    (req: Request, res: Response) => {
        /*  
            #swagger.description = 'Endpoint to get a CSRF token for User.'
    
            #swagger.responses[200] = {
                description: 'CSRF token retrieved successfully.',
                schema: { csrfToken: 'string' }
            }

            #swagger.responses[401] = {
                description: 'Unauthorized, login failed.',
                schema: { $ref: "#/definitions/NotLoginError"  }
            }
        */

        res.status(200).json({ csrfToken: csrfProtection.generateToken(req) });
    })
export { authRouter };
