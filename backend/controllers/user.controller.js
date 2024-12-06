import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { Resend } from "resend"; // Import Resend
import verifyEmailTemplate from "../utils/verifyemail.js";
import generateAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generatedRefreshToken.js"; // Import the email template
import uploadImageClodinary from "../utils/uploadimageClodinary.js";
import { response } from "express";

const resend = new Resend(process.env.RESEND_API); // Initialize Resend with your API key

export async function refisterUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists in the database
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    // Create the user in the database
    const newUser = await UserModel.create(payload);
    const savedUser = await newUser.save();

    // Generate the email verification URL
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;

    // Send the verification email using Resend
    const emailResponse = await resend.emails.send({
      from: "YourApp <no-reply@yourapp.com>", // Update with your email address
      to: email,
      subject: "Verify your email",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    // Send response back to client
    return res.json({
      message: "User created successfully",
      success: true,
      error: false,
      data: savedUser,
      emailResponse, // Optionally include the response for debugging
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.query;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      { $set: { verify_email: true } }
    );

    return res.json({
      message: "Email verified successfully",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.status !== "active") {
      return res.status(400).json({
        message: "User is not active",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "User logged in successfully",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function logoutController(req, res) {
  try {
    const userid = req.userId;

    const cookiesOption = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(
      userid,
      { $set: { refresh_token: null } },
      { new: true }
    );

    return res.json({
      message: "User logged out successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId?.id; // Extract user ID from the decoded JWT object
    const image = req.file;

    console.log("Uploaded File:", image);

    if (!image) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    const upload = await uploadImageClodinary(image);
    console.log("Cloudinary Upload Response:", upload);

    // Update user avatar in the database
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { avatar: upload.url } },
      { new: true } // Return updated document
    );

    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Image uploaded successfully",
      data: {
        _id: updateUser._id,
        avatar: updateUser.avatar,
      },
      success: true,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return res.status(500).json({
      message: error.message || "An error occurred during upload",
      error: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    let hashedPassword = "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password && { password: hashedPassword })
    );

    return res.status(200).json({
      message: "User details updated successfully",
      error: false,
      data: updateUser,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}
