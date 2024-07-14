import { Schema, model, Document } from "mongoose";
import { emailValidator } from "../validators/userValidation";

export interface IStudentProfile extends Document {
  name: string;
  image: string;
  email: string;
  phone: string;
}

const studentProfileSchema: Schema = new Schema<IStudentProfile>(
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
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

studentProfileSchema.index({ name: "text", email: "text" });

const Student = model<IStudentProfile>("Student", studentProfileSchema);
export default Student;
