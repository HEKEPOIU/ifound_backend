import { Application } from "express";
import cors from "cors"

function SetupCors(app: Application) {

    const corsSetting = cors({
        origin: "http://localhost:5173", // need to spcific the origin if need send cookies.
        credentials: true, // This is allow get cookies
    });

    if (app.get('env') === "production") {
        //Set the prod option.
    }

    return corsSetting;
}

export { SetupCors };
