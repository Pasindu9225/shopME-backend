import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { Resend } from "resend"; // Import Resend
import verifyEmailTemplate from "../utils/verifyemail.js"; // Import the email template

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
