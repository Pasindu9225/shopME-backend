import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import { connectDB } from "./config/db.js";
import userRouter from "./routs/user.route.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
