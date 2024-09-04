import { ArticleModel } from "@codesRoot/db/schemas/article";
import { ArticleDocument } from "@codesRoot/db/schemas/articleType";
import { UserDocument } from "@codesRoot/db/schemas/userType";
import { articleIdCheck, articleQueryCheck, articleSearchStringQueryCheck, returnIfNotPass, uploadArticleCheck } from "@codesRoot/db/schemas/validator";
import { IFoundError } from "@codesRoot/middleware/errorType";
import { multerconfig, processImagetojpg } from "@codesRoot/middleware/imageConfig";
import { RequestLogin } from "@codesRoot/middleware/LoginRequest";
import { GetLatestArticleList } from "@codesRoot/utils/helper";
import { limiter } from "@codesRoot/utils/rateLimitconfig";
import { searchArticleFuseOptions, searchTagFuseOption } from "@codesRoot/utils/searchOption";
import { NextFunction, Request, Response, Router } from "express";
import { matchedData } from "express-validator";
import Fuse, { FuseResult } from "fuse.js";

const articleRouter = Router()

//TODO: Separate the Logic to own function for better readability
articleRouter.post('/upload',
    RequestLogin,
    multerconfig.single("Image"),
    uploadArticleCheck,
    returnIfNotPass,
    limiter,
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
            return next(err);
        }
    })

articleRouter.get("/search",
    articleSearchStringQueryCheck,
    articleQueryCheck,
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            data.From = data.From === undefined ? 0 : data.From
            data.Length = data.Length === undefined ? 30 : data.Length
            const articleList: Array<ArticleDocument> = await ArticleModel.find();
            const articleSearchMap = new Fuse(articleList, searchArticleFuseOptions)
                .search(data.Keyword)
                .map((value: FuseResult<ArticleDocument>) => {
                    return value.item
                })
            const articleListMap = GetLatestArticleList(articleSearchMap, data.From, data.Length);
            res.status(200).json({ ArticleList: articleListMap })
        } catch (err) {
            next(err)
        }
    })

articleRouter.get("/tagsSearch",
    articleSearchStringQueryCheck,
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            const tags = await ArticleModel.getUniqueTagsList();
            const searchTags = new Fuse(tags, searchTagFuseOption)
                .search(data.Keyword)
                .filter((value, index) => {
                   return index < 10 
                })
                .map((value) => {
                    return value.item
                })
            res.status(200).json({ Tags: searchTags })
        } catch (err) {
            next(err)
        }
    })

articleRouter.get("/allTags",
    limiter,
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const tags = await ArticleModel.getUniqueTagsList();
            res.status(200).json({ Tags: tags })
        } catch (err) {
            next(err)
        }
    })


articleRouter.get("/:id",
    articleIdCheck,
    returnIfNotPass,
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            const findArticle = await ArticleModel.findById(data.id);
            if (!findArticle) {
                return next(new IFoundError("Article Not Found.", 404, [`Article ID: ${req.params.id} not Found`]))
            }
            const articleData = {
                id: findArticle.id,
                Image: process.env.IMAGEPATH + findArticle.Image,
                Tags: findArticle.Tags,
                Name: findArticle.Name,
                DetailInfo: findArticle.DetailInfo,
                OwnerID: findArticle.OwnerID,
                CreatedAt: findArticle.CreatedAt,
                UpdatedAt: findArticle.UpdatedAt,
            }
            return res.status(200).json(articleData)
        } catch (err) {
            return next(err);
        }
    })
articleRouter.get("/",
    articleQueryCheck,
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            data.From = data.From === undefined ? 0 : data.From
            data.Length = data.Length === undefined ? 30 : data.Length
            const articleList: Array<ArticleDocument> = await ArticleModel.find();
            const articleListMap = GetLatestArticleList(articleList, data.From, data.Length);
            res.status(200).json({ ArticleList: articleListMap })
        } catch (err) {
            next(err)
        }
    })
articleRouter.delete("/:id",
    RequestLogin,
    articleIdCheck,
    returnIfNotPass,
    limiter,
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const data = matchedData(req);
            const user = req.user as UserDocument;
            const findArticle = await ArticleModel.findById(data.id);
            if (!findArticle) {
                return next(new IFoundError("Article Not Found.", 404, [`Article ID: ${data.id} not Found`]))
            }
            const isOwn = findArticle.OwnerID.equals(user.id)
            if (!isOwn && user.Permission !== 1) {
                return next(new IFoundError("Insufficient permissions", 403, ["This Article not belong User."]))
            }
            const ownUser = await findArticle.getOwner()
            await ownUser.updateOne({ $pull: { ArticleIDList: data.id } })
            await ArticleModel.deleteOne({ _id: findArticle._id })
            return res.sendStatus(200)
        } catch (err) {
            return next(err);
        }
    })



export { articleRouter }

