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
    const result: Result = validationResult(req);
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
        const user = req.user as UserDocument;
        res.status(200).json({ Permission: user.Permission });
    }
)
// Why delete? See the doc:
// https://www.passportjs.org/concepts/authentication/logout/
authRouter.delete("/logout", RequestLogin, (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('connect.sid');  // clear the cookie
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.sendStatus(205);
        })
    });
})
export { authRouter, RequestLogin };
