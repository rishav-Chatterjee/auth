import express from "express";

import * as authController from "../controllers/authController.ts";

const authRouter = express.Router();

// user register route
authRouter.post("/register", authController.registerHandler);

// token register route
authRouter.get("/token", authController.tokenHandler);

// refresh token
authRouter.get("/refresh-token", authController.refreshTokenHandler);

export default authRouter;
