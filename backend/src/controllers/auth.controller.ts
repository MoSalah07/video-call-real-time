import { Request, Response, RequestHandler } from "express";
import {
  IUserInput,
  IUserLoginInput,
  IUserOnboardInput,
  AuthenticatedRequest,
} from "../interfaces/auth.interface";
import User from "../models/User.model";
import {
  validateUserInput,
  checkExistingUser,
  setAuthCookie,
  generateToken,
  InvalidRequest,
} from "../lib/auth.helper";
import { upsertStreamUser } from "../lib/stream";

const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    InvalidRequest(req, res);
    const { fullName, email, password }: IUserInput = req.body;
    const validationError = validateUserInput(email, password, fullName);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    if (await checkExistingUser(email)) {
      res
        .status(400)
        .json({ message: "Email already exists, Please use another email" });
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/i;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Email must be from gmail.com, yahoo.com, or hotmail.com",
      });
      return;
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
    });

    // UpdateStreamUser
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });

    const token = generateToken(newUser);
    setAuthCookie(res, token);

    res.status(201).json({
      message: "User created successfully",
      data: {
        success: true,
        token,
        user: {
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      },
    });
    return;
  } catch (err) {
    console.log(`Error in Signup Controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const login: RequestHandler = async (req: Request, res: Response) => {
  try {
    InvalidRequest(req, res);
    const { email, password }: IUserLoginInput = req.body;
    const validationError = validateUserInput(email, password);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      message: "User is logged in successfully",
      data: {
        success: true,
        token,
        user: {
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
        },
      },
    });
    return;
  } catch (err) {
    console.log(`Error in Login Controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "User is logged out successfully",
      data: {
        success: true,
      },
    });
    return;
  } catch (err) {
    console.log(`Error in Logout Controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

const onboard: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    InvalidRequest(req, res);

    const {
      fullName,
      bio,
      country,
      learningLanguage,
      nativeLanguage,
    }: IUserOnboardInput = req.body;

    // Validation
    if (!fullName || !bio || !country || !learningLanguage || !nativeLanguage) {
      res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !country && "country",
          !learningLanguage && "learningLanguage",
          !nativeLanguage && "nativeLanguage",
        ].filter(Boolean),
      });
      return;
    }

    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    ).select("-password");

    if (!userUpdated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // UpdateStreamUser
    await upsertStreamUser({
      id: userUpdated._id.toString(),
      name: userUpdated.fullName,
      image: userUpdated.profilePic || "",
    });

    res.status(200).json({
      message: "User is onboarded successfully",
      data: {
        success: true,
        userUpdated,
      },
    });
    return;
  } catch (err) {
    console.log(`Error in Onboarding Controller: ${err}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getInfoCurrentUser: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }
    res.status(200).json({
      message: "Get Info Current User",
      data: { success: true, user },
    });
    return;
  } catch (err) {
    console.error("Error In getInfoCurrentUser: ", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export { register, login, logout, onboard, getInfoCurrentUser };
