import { HashPassword } from "../utils/helper";
import { User } from "./schemas/user";

async function InitAdmin(adminName: string = "admin", password: string = "passport") {
    //Check If target admin Init. 
    const data = await User.findOne({ "Account": adminName, "Password": password });
    if (data !== null) {
        if (data.Permission === 1) {
            console.debug(`User ${adminName} Already Exit, and it is admin.`)
        } else {
            console.debug(`The User Already exit, and it not a admin.`)
        }
        return false;
    }

    const hashPassword = await HashPassword(password);
    //Init if Not.
    const adminData = new User({
        Account: adminName,
        Password: hashPassword,
        Permission: 1
    })
    try {
        await adminData.save();
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}

export { InitAdmin }
