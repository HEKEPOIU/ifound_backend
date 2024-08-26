import mongoose, { Schema, Types, CallbackWithoutResultAndOptionalError } from "mongoose";
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
    Image: { type: String, required: true },
    Tags: { type: [String], default: [] },
    Name: { type: String, required: true },
    DetailInfo: new Schema<IDetilInfo>({
        Description: { type: String },
        FoundLocation: { type: String },
        CurrentLocation: { type: String, required: true }
    }),
    OwnerID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
}, {
    timestamps: {
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt"
    }
})

articleSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    if (this.DetailInfo.FoundLocation === "") {
        this.DetailInfo.FoundLocation = this.DetailInfo.CurrentLocation;
    }
    next()
})

const ArticleModel = mongoose.model<ArticleDocument, ArticleModelType>('Article', articleSchema);
export { ArticleModel, IArticle, IDetilInfo }; 
