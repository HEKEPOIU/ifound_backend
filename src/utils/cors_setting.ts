import { Application } from "express";
import cors from "cors"

function SetupCors(app: Application) {

    const corsSetting = cors();

    if (app.get('env') === "production") {
        //Set the prod option.
    }

    return corsSetting;
}

export { SetupCors };
