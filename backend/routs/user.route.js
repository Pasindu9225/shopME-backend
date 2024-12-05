import express from "express";
import {
  refisterUserController,
  verifyEmailController,
  loginController,
} from "../controllers/user.controller.js";

const userRouter = express.Router(); // Correctly initialize the router

userRouter.post("/register", refisterUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);

export default userRouter;
