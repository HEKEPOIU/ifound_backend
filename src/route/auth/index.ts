import { NextFunction, Request, Response, Router } from "express";
import { registerUserCheck, returnIfNotPass } from "@codesRoot/db/schemas/validator";
import { matchedData } from "express-validator";
import { UserModel } from "@codesRoot/db/schemas/user";
import { HashPassword } from "@codesRoot/utils/helper";
import passport from "passport";
import { UserDocument } from "@codesRoot/db/schemas/userType";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { IFoundError } from "@codesRoot/middleware/errorType";
import { csrfProtection } from "@codesRoot/utils/csrfProtection";

const authRouter = Router();

authRouter.post("/register", registerUserCheck, returnIfNotPass, async (req: Request, res: Response, next: NextFunction) => {


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

        #swagger.responses[403] = {
            description: 'ForbiddenError: invalid csrf token',
            schema: { $ref: "#/definitions/ForbiddenError" }
        }
        
        #swagger.parameters['X-CSRF-Token'] = {
            in: 'header',
            description: 'CSRF Token',
            type: 'string',
            required: true,
        }
    */

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

            #swagger.responses[403] = {
                description: 'ForbiddenError: invalid csrf token',
                schema: { $ref: "#/definitions/ForbiddenError" }
            }
            
            #swagger.parameters['X-CSRF-Token'] = {
                in: 'header',
                description: 'CSRF Token',
                type: 'string',
                required: true,
            }
        */
        const user = req.user as UserDocument;
        res.status(200).json({ Permission: user.Permission });
    }
)
// Why delete? See the doc:
// https://www.passportjs.org/concepts/authentication/logout/
authRouter.delete("/logout", RequestLogin,
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
    

            #swagger.responses[401] = {
                description: 'Unauthorized, Not Login.',
                schema: { $ref: "#/definitions/NotLoginError"  }
            }

            #swagger.responses[403] = {
                description: 'ForbiddenError: invalid csrf token',
                schema: { $ref: "#/definitions/ForbiddenError" }
            }
            
            #swagger.parameters['X-CSRF-Token'] = {
                in: 'header',
                description: 'CSRF Token',
                type: 'string',
                required: true,
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

authRouter.get("/getPermission",
    RequestLogin,
    (req: Request, res: Response) => {
        const user = req.user as UserDocument;
        /*
            #swagger.description = 'Get User Permission.'

            #swagger.responses[200] = {
                description: 'Get Permission successful.',
                schema: { $ref: "#/definitions/LoginSuccess" }
            }

            #swagger.responses[401] = {
                description: 'Unauthorized, Not Login.',
                schema: { $ref: "#/definitions/NotLoginError"  }
            }

            #swagger.responses[403] = {
                description: 'ForbiddenError: invalid csrf token',
                schema: { $ref: "#/definitions/ForbiddenError" }
            }
            
            #swagger.parameters['X-CSRF-Token'] = {
                in: 'header',
                description: 'CSRF Token',
                type: 'string',
                required: true,
            }
        */
        res.status(200).json({ Permission: user.Permission });

    })

authRouter.get("/getToken",
    (req: Request, res: Response) => {
        /*  
            #swagger.description = 'Endpoint to get a CSRF token .'
    
            #swagger.responses[200] = {
                description: 'CSRF token retrieved successfully.',
                schema: { csrfToken: 'string' }
            }
            
        */
        res.status(200).json({ csrfToken: csrfProtection.generateToken(req, res, false, false) });
    })
export { authRouter };
