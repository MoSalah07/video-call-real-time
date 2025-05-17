import mongoose, { Schema, CallbackError, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/auth.interface";

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    country: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Pre Hook middleware executed before saving in db
// hashing password
UserSchema.pre("save", async function (next: (err?: CallbackError) => void) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return next(error as CallbackError);
    } else {
      return next(new Error("Unknown error during password hashing"));
    }
  }
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
