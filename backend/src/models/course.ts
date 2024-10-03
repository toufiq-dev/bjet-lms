import { Schema, model, Document } from "mongoose";

type CourseStatus = "draft" | "published" | "archived";

export interface ICourse extends Document {
  title: string;
  description: string;
  status: CourseStatus;
  teacherRef: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema: Schema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      required: [true, "Course status is required"],
    },
    teacherRef: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", courseSchema);
export default Course;
