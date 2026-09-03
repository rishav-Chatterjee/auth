import express, { type Express } from "express";
import authRouter from "./routes/authRoute.ts";
import errorHandler from "./middleware/errorHandler.ts";
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

export default app;
