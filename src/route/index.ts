import { Router } from "express";
import { authRouter } from "./auth";
import passport from "passport";
import { localStrategy } from "./auth/local-strategy";
import { articleRouter } from "./article";

const router = Router();

passport.use(localStrategy);
router.use("/auth", authRouter
    /* 	#swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to Authentication a user' 
    */
);
router.use("/article", articleRouter)


export { router }
