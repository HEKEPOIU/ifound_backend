import { IStrategyOptions, Strategy } from "passport-local";
import { UserModel } from "@codesRoot/db/schemas/user";
import { ComparePassword } from "@codesRoot/utils/helper";
import passport from "passport";
import { UserDocument } from "@codesRoot/db/schemas/userType";


const strateOption: IStrategyOptions = {
    usernameField: "Account",
    passwordField: 'Password'
}
passport.serializeUser((user, done) => {
    const mongooseUser: UserDocument = user as UserDocument;
    done(null, mongooseUser.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await UserModel.findById(id).exec();
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (err) {
        done(err, false);

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
