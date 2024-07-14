import { Schema, model, Document } from "mongoose";
import { emailValidator } from "../validators/userValidation";

export interface ITeacherProfile extends Document {
  name: string;
  image: string;
  email: string;
  bio: string;
  qualifications: string[];
  courseRefs: Schema.Types.ObjectId[];
}

const teacherProfileSchema: Schema = new Schema<ITeacherProfile>(
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
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    courseRefs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

teacherProfileSchema.index({ name: "text", email: "text", bio: "text" });

const Teacher = model<ITeacherProfile>("Teacher", teacherProfileSchema);
export default Teacher;
