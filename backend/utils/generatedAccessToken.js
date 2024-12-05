import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const token = await jwt.sign(
    { id: user._id },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "4h" }
  );

  return token;
};

export default generateAccessToken;
