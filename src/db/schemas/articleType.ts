import { Model } from "mongoose"
import { Document } from "mongoose"
import { IArticle } from "./article"
import { UserDocument } from "./userType"
interface ArticleModelType extends Model<ArticleDocument> {
    // Can add User Model specific function on it.
    getUniqueTagsList(): Promise<Array<string>>
}

interface ArticleDocument extends IArticle, Document {
    // Keep it Empty now, we can add function on it.
    getOwner(): Promise<UserDocument>

}


export { ArticleModelType, ArticleDocument }
