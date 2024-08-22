import { Model } from "mongoose"
import { Document } from "mongoose"
import { IArticle } from "./article"
interface ArticleModelType extends Model<ArticleDocument> {
    // Can add User Model specific function on it.
}

interface ArticleDocument extends IArticle, Document {
    // Keep it Empty now, we can add function on it.
}


export { ArticleModelType, ArticleDocument }
