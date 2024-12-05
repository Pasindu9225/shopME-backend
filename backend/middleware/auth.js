import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Provide token" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    req.user = decoded;

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    req.userId = decoded;

    next();

    console.log("decoded", decoded);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default auth;
