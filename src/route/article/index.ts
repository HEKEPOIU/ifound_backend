import { processImagetojpg } from "@codesRoot/middleware/imageConfig";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { NextFunction, Request, Response, Router } from "express";

const articleRouter = Router()

articleRouter.post('/upload',
    RequestLogin,
    processImagetojpg('Image'),
    (req: Request, res: Response, _next: NextFunction) => {
        console.log(req.body)
        res.status(200).send("work")
    })

export { articleRouter }

