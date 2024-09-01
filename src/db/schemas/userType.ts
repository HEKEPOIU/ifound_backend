import { Model } from "mongoose"
import { IUser } from "./user"
import { Document } from "mongoose"
import { ArticleDocument } from "./articleType"
interface UserModelType extends Model<UserDocument> {
    // Can add User Model specific function on it.
}

interface UserDocument extends IUser, Document {
    // Keep it Empty now, we can add function on it.
    getArticleList():Promise<Array<ArticleDocument>>
}


export { UserModelType, UserDocument }
