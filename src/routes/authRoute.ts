import express from "express";

import authHandler from "../controllers/authController.ts";

const authRouter = express.Router();

// define the about route
authRouter.post("/token", authHandler);

export default authRouter;
