import mongoose, { Schema, Types } from "mongoose";
import { UserDocument, UserModelType } from "./userType";


interface IUser {
    Account: string;
    Password: string;
    UploadCount: number;
    ArticleIDList: [Types.ObjectId]
    Permission: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}
// Permission is [0,1] 1 for admin, 0 for normal user.
const userSchema = new Schema<UserDocument, UserModelType>({
    Account: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    UploadCount: {
        type: Number,
        default: 0,
    },
    ArticleIDList: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Article'
    },
    Permission: {
        type: Number,
        required: true,
    },

}, {
    timestamps: {
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt"
    }
}
);


const UserModel = mongoose.model<UserDocument, UserModelType>('User', userSchema);
export { UserModel, IUser }; 
