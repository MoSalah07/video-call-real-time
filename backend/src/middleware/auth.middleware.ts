import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.model";
import { Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const protectRoute: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || ""
    ) as MyJwtPayload;
    if (!decode) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      res.status(401).json({ message: "Unauthorized - User Not Found" });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(`Error in Protect Route Middleware: ${err}`);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
