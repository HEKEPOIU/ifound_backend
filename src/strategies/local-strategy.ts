import { IStrategyOptions, Strategy } from "passport-local";
import { UserModel } from "../db/schemas/user";
import { ComparePassword } from "../utils/helper";
import passport from "passport";
import { UserDocument } from "../db/schemas/userType";


const strateOption: IStrategyOptions = {
    usernameField: "Account",
    passwordField: 'Password'
}
passport.serializeUser((user, down) => {
    const mongooseUser: UserDocument = user as UserDocument;
    down(null, mongooseUser.id);
})

passport.deserializeUser(async (id, down) => {
    try {
        const findUser = await UserModel.findById(id).exec();
        if (!findUser) throw new Error("User Not Found");
        down(null, findUser);
    } catch (err) {
        down(err, false);

    }
})

const localStrategy = new Strategy(strateOption, async (username, passport, done) => {
    try {
        const findUser = await UserModel.findOne({ Account: username }).exec();
        if (!findUser) return done(null, false);
        const isPasswordCorrect = await ComparePassword(findUser.Password, passport);
        if (!isPasswordCorrect) return done(null, false);
        return done(null, findUser);
    } catch (err) {
        return done(err);
    }

});

export { localStrategy };
