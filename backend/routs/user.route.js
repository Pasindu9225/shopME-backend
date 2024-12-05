import express from "express";
import {
  refisterUserController,
  verifyEmailController,
  loginController,
  logoutController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router(); // Correctly initialize the router

userRouter.post("/register", refisterUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.post("/logout", auth, logoutController);

export default userRouter;
