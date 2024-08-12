import { Schema, model, Document } from "mongoose";
import {
  emailValidator,
  passwordValidator,
} from "../validators/userValidation";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "Student" | "Teacher" | "Admin";
  active: boolean;
  invalidLoginAttempts: number | null;
  lockLogin: Date | null;
  passwordResetReq: number | null;
  lockResetPassword: Date | null;
  studentRef?: Schema.Types.ObjectId | null;
  teacherRef?: Schema.Types.ObjectId | null;
  adminRef?: Schema.Types.ObjectId | null;
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: emailValidator,
        message: "Invalid email format",
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: passwordValidator,
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      },
    },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin"],
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    invalidLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockLogin: {
      type: Date,
      default: null,
    },
    passwordResetReq: {
      type: Number,
      default: 0,
    },
    lockResetPassword: {
      type: Date,
      default: null,
    },
    studentRef: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    teacherRef: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    adminRef: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, role: 1 });

const User = model<IUser>("User", userSchema);
export default User;
