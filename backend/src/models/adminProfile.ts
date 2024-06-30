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
      //   validate: {
      //     validator: (v: string) =>
      //       /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v),
      //     message: "Image must be a valid URL to an image file",
      //   },
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
