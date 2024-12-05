import express from "express";
import {
  refisterUserController,
  verifyEmailController,
} from "../controllers/user.controller.js";

const userRouter = express.Router(); // Correctly initialize the router

userRouter.post("/register", refisterUserController);
userRouter.post("/verify-email", verifyEmailController);

export default userRouter;
