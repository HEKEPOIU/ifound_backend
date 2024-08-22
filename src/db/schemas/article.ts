import mongoose, { Schema, Types } from "mongoose";
import { ArticleDocument, ArticleModelType } from "./articleType";

interface IArticle {
    Image: string;
    Tags: [string];
    Name: string;
    DetailInfo: IDetilInfo;
    OwnerID: Types.ObjectId;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface IDetilInfo {
    Description: string,
    FoundLocation: string,
    CurrentLocation: string
}

const articleSchema = new Schema<ArticleDocument, ArticleModelType>({

}, {
    timestamps: {
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt"
    }
})

const ArticleModel = mongoose.model<ArticleDocument, ArticleModelType>('article', articleSchema);
export { ArticleModel, IArticle, IDetilInfo }; 
