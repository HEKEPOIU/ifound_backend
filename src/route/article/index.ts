import { ArticleModel } from "@codesRoot/db/schemas/article";
import { ArticleDocument } from "@codesRoot/db/schemas/articleType";
import { UserModel } from "@codesRoot/db/schemas/user";
import { UserDocument } from "@codesRoot/db/schemas/userType";
import { returnIfNotPass, uploadArticleCheck } from "@codesRoot/db/schemas/validator";
import { IFoundError } from "@codesRoot/middleware/errorType";
import { multerconfig, processImagetojpg } from "@codesRoot/middleware/imageConfig";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { NextFunction, Request, Response, Router } from "express";
import { matchedData } from "express-validator";

const articleRouter = Router()

//TODO: Separate the Logic to own function for better readability
articleRouter.post('/upload',
    RequestLogin,
    multerconfig.single("Image"),
    uploadArticleCheck,
    returnIfNotPass,
    processImagetojpg('Image'),
    async (req: Request, res: Response, next: NextFunction) => {
        const data = matchedData(req);
        const user = req.user as UserDocument;
        const newArticle: ArticleDocument = new ArticleModel();
        newArticle.Tags = data.Tags;
        newArticle.Name = data.Name;
        const filename = req.file?.filename as string;
        newArticle.Image = filename;
        newArticle.DetailInfo = {
            CurrentLocation: data.CurrentLocation,
            Description: data.Description,
            FoundLocation: data.FoundLocation,
        }
        newArticle.OwnerID = user.id;
        try {
            await newArticle.save()
            await user.updateOne({ $push: { ArticleIDList: newArticle.id } })
            return res.status(200).json({ message: "Article Upload.", id: newArticle.id })
        } catch (err) {

            if (err instanceof Error) {
                if (err.name == "MongoServerError") {
                    return next(new IFoundError(err.name, 409, [err.message]));
                }

                return next(err);

            }
        }
    })

articleRouter.get("/uploadCount",
    RequestLogin,
    (req: Request, res: Response) => {
        const user = req.user as UserDocument;
        return res.status(200).json({ count: user.ArticleIDList.length })
    })


articleRouter.delete("/:id",
    RequestLogin,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as UserDocument;
            const findArticle = await ArticleModel.findById(req.params.id);
            if (!findArticle) {
                return next(new IFoundError("Article Not Found.", 404, [`Article ID: ${req.params.id} not Found`]))
            }
            const isOwn = findArticle.OwnerID.equals(user.id)
            if (!isOwn && user.Permission !== 1) {
                return next(new IFoundError("Insufficient permissions", 403, ["This Article not belong User."]))
            }
            if (isOwn) {
                user.updateOne({ $pull: { ArticleIDList: req.params.id } })
            }
            else {
                await UserModel.updateOne({
                    ArticleIDList: req.params.id
                }, {
                    $pull: { ArticleIDList: req.params.id }
                })
            }
            await ArticleModel.deleteOne({ _id: findArticle._id })
            return res.sendStatus(200)
        } catch (err) {
            if (err instanceof Error) {
                if (err.name == "MongoServerError") {
                    return next(new IFoundError(err.name, 409, [err.message]));
                }
            }

            return next(err);
        }
    })



export { articleRouter }

