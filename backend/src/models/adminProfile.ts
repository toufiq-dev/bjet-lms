import { Schema, model, Document } from "mongoose";
import { emailValidator } from "../validators/userValidation";

export interface IAdminProfile extends Document {
  name: string;
  image: string;
  email: string;
}

const adminProfileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    image: {
      type: String,
    },
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
  },
  {
    timestamps: true,
  }
);

adminProfileSchema.index({ name: "text", email: "text" });

const Admin = model<IAdminProfile>("Admin", adminProfileSchema);
export default Admin;
