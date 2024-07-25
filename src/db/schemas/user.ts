import mongoose, { Schema, Types } from "mongoose";
import { UserDocument, UserModel } from "./userType";


interface IUser {
    Account: string;
    Password: string;
    UploadCount: number;
    ArtivleIDList: [Types.ObjectId]
    Permission: number;
    CreateDate: Date;
}
// Permission is [0,1] 1 for admin, 0 for normal user.
const userSchema = new Schema<UserDocument, UserModel>({
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
    ArtivleIDList: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
    Permission: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true,
});


const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export { UserModel, IUser }; 
