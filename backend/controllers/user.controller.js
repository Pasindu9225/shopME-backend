import bcrypt from "bcrypt";

import UserModel from "../models/user.model.js";

export async function refisterUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newuser = await UserModel.create(payload);
    const save = await newuser.save();

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify your email",
      html: "",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
