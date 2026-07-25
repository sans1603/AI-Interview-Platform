import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    const { token, user } = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid email or password",
    });
  }
};