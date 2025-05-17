import jwt from "jsonwebtoken";
import User from "../models/User.model";
import { IUser } from "../interfaces/auth.interface";
import { Response, Request } from "express";

export function validateUserInput(
  email: string,
  password: string,
  fullName?: string | undefined
): string | null {
  if (!email || !password) return "All fields are required";
  if (fullName !== undefined && fullName.trim() === "") {
    return "Full name cannot be empty";
  }
  if (password.length < 6) return "Password must be at least 6 characters";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
}

export async function checkExistingUser(email: string): Promise<boolean> {
  const existingUser = await User.findOne({ email });
  return !!existingUser;
}

export function generateToken(user: IUser): string {
  return jwt.sign(
    { userId: user._id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET_KEY || "",
    { expiresIn: "1d" }
  );
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function InvalidRequest(req: Request, res: Response): void {
  if (!req.body) {
    res.status(400).json({
      message: "Invalid request body",
    });
    return;
  }
}
