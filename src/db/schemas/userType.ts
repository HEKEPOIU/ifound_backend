import { Model } from "mongoose"
import { IUser } from "./user"
import { Document } from "mongoose"
interface UserModelType extends Model<UserDocument> {
    // Can add User Model specific function on it.
}

interface UserDocument extends IUser, Document {
    // Keep it Empty now, we can add function on it.
}


export { UserModelType, UserDocument }
