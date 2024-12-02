import express from "express";
import { refisterUserController } from "../controllers/user.controller.js";

const userRouter = express.Router(); // Correctly initialize the router

userRouter.post("/register", refisterUserController);

export default userRouter;
