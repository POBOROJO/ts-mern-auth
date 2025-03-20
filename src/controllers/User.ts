import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../models/User";
import { loginSchema, registerSchema } from "../schemas/authSchemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "middleware/auth";

dotenv.config();
export const registerController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { success } = registerSchema.safeParse(body);

    if (!success) {
      res.status(400).json({
        success: false,
        message: "Invalid data input",
      });
      return; // Exit early
    }

    const { name, email, password } = body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return; // Exit early
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    // Success response at the end
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { success } = loginSchema.safeParse(body);
    if (!success) {
      res.status(400).json({
        success: false,
        message: "Invalid data input",
      });
      return; // Exit early
    }

    const { email, password } = body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found, please register",
      });
      return; // Exit early
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return; // Exit early
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const meController = async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.user?.id).select("-password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Exit early
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};