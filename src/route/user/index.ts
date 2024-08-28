import { UserDocument } from "@codesRoot/db/schemas/userType";
import { articleQueryCheck } from "@codesRoot/db/schemas/validator";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { GetLatestArticleList } from "@codesRoot/utils/helper";
import { NextFunction, Request, Response, Router } from "express";
import { matchedData } from "express-validator";


const userRouter = Router()

userRouter.get("/getOwn",
    RequestLogin,
    articleQueryCheck,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            data.From = data.From === undefined ? 0 : data.From
            data.Length = data.Length === undefined ? 30 : data.Length
            const user = req.user as UserDocument;
            const articleList = await user.getArticleList();
            const articleListMap =  GetLatestArticleList(articleList, data.From, data. Length);
            res.status(200).json({ ArticleList: articleListMap })
        } catch (err) {
            next(err)
        }
    })

userRouter.get("/uploadCount",
    RequestLogin,
    (req: Request, res: Response) => {
        const user = req.user as UserDocument;
        return res.status(200).json({ count: user.ArticleIDList.length })
    })

export { userRouter }
