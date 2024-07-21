import { Request, Response, Router } from "express";
import { registerUserCheck } from "../db/schemas/userValidator";
import { matchedData, Result, validationResult } from "express-validator";
import { User } from "../db/schemas/user";
import { MongooseError } from "mongoose";
import { HashPassword } from "../utils/helper";

const authRouter = Router()


authRouter.post("/register", registerUserCheck, async (req: Request, res: Response) => {
    const result: Result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() })
    }

    const data = matchedData(req);
    data.Password = await HashPassword(data.Password);

    const newUser = new User({ ...data, Permission: 0 });
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
export { authRouter };
