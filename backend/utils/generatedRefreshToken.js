import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = async (user) => {
  const token = await jwt.sign(
    { id: user._id },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  const updateRefreshToken = await UserModel.updateOne(
    { _id: user._id },
    { $set: { refresh_token: token } }
  );

  return token;
};

export default generateRefreshToken;
