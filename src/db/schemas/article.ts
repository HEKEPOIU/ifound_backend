import mongoose, { Schema, Types, CallbackWithoutResultAndOptionalError } from "mongoose";
import { ArticleDocument, ArticleModelType } from "./articleType";
import { UserDocument } from "./userType";

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
        Description: { type: String, default: "" },
        FoundLocation: { type: String, default: "" },
        CurrentLocation: { type: String, required: true }
    }, {
        _id: false
    }),
    OwnerID: { type: Schema.Types.ObjectId, required: true, ref: "User" },
}, {
    timestamps: {
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt"
    }
})
articleSchema.methods.getOwner = async function (): Promise<UserDocument> {
    const populateArticle = await this.populate("OwnerID")
    return populateArticle.OwnerID as UserDocument
}

articleSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
    if (this.DetailInfo.FoundLocation === "") {
        this.DetailInfo.FoundLocation = this.DetailInfo.CurrentLocation;
    }
    next()
})

const ArticleModel = mongoose.model<ArticleDocument, ArticleModelType>('Article', articleSchema);

ArticleModel.getUniqueTagsList = async function (): Promise<Array<string>> {
    const articleList: Array<ArticleDocument> = await this.find();
    //Get Unique Tags string.
    const tags = [...new Set(articleList.map((value: ArticleDocument) => {
        return value.Tags
    }).flat())]
    return tags;
}
export { ArticleModel, IArticle, IDetilInfo }; 
