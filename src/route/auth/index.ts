import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { registerUserCheck } from "@codesRoot/db/schemas/userValidator";
import { matchedData, Result, validationResult } from "express-validator";
import { UserModel } from "@codesRoot/db/schemas/user";
import { MongooseError } from "mongoose";
import { HashPassword } from "@codesRoot/utils/helper";
import passport from "passport";
import { UserDocument } from "@codesRoot/db/schemas/userType";

const authRouter = Router()

const RequestLogin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(401);
    next();
}

authRouter.post("/register", registerUserCheck, async (req: Request, res: Response) => {


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
            schema: {
                errors: [
                    {
                        location: 'body',
                        msg: 'string',
                        param: 'string',
                        value: 'string'
                    }
                ]
            }
        }

        #swagger.responses[409] = {
            description: 'Conflict error, likely due to a duplicate user.',
            schema: {  message: 'string', name: 'MongooseError' }
        }

        #swagger.responses[500] = {
            description: 'Unknown server error.',
            schema: { message: 'Unknown errors', error: 'object' }
        }
        #swagger.responses[403] = {
            description: 'ForbiddenError: invalid csrf token',
            schema: { message: 'html' }
        }
    */    const result: Result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }

    const data = matchedData(req);
    data.Password = await HashPassword(data.Password);

    const newUser = new UserModel({ ...data, Permission: 0 });
    try {
        await newUser.save();
        return res.status(201).json({ message: "User created" })
    } catch (err) {
        if (err instanceof MongooseError) {
            return res.status(409).json({ name: err.name, message: err.message })
        }
        return res.status(500).json({ message: "Unknown errors", error: err })
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
                schema: { Permission: 'number' }
            }

            #swagger.responses[401] = {
                description: 'Unauthorized, login failed.',
                schema: { message: 'Unauthorized' }
            }
            #swagger.responses[403] = {
                description: 'ForbiddenError: invalid csrf token',
                schema: { message: 'html' }
            }
        */
        const user = req.user as UserDocument;
        res.status(200).json({ Permission: user.Permission });
    }
)
// Why delete? See the doc:
// https://www.passportjs.org/concepts/authentication/logout/
authRouter.delete("/logout", RequestLogin, (req: Request, res: Response, next: NextFunction) => {
    /*  
        #swagger.description = 'Endpoint to log out a user.'

        #swagger.responses[205] = {
            description: 'User logged out successfully.'
        }

        #swagger.responses[500] = {
            description: 'Unknown server error.',
            schema: { message: 'Unknown errors', error: 'object' }
        }

        #swagger.responses[401] = {
            description: 'User Not Login.',
        }

        #swagger.responses[403] = {
            description: 'ForbiddenError: invalid csrf token',
            schema: { message: 'html' }
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

authRouter.get("/getToken", (req: Request, res: Response) => {
    /*  
        #swagger.description = 'Endpoint to get a CSRF token.'

        #swagger.responses[200] = {
            description: 'CSRF token retrieved successfully.',
            schema: { csrfToken: 'string' }
        }
    */

    res.set('X-CSRF-Token', req.csrfToken());
    res.status(200).json({ csrfToken: req.csrfToken() });
})
export { authRouter, RequestLogin };
