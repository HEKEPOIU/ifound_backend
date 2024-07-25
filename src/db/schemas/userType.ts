import { Model } from "mongoose"
import { IUser } from "./user"
import { Document } from "mongoose"
interface UserModel extends Model<UserDocument> {
    // Can add User Model spcific function on it.
}

interface UserDocument extends IUser, Document {
    // Keep it Empty now, wee can add funcion on it.
}


export { UserModel, UserDocument }
