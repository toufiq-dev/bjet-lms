import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
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
      index: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
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

courseSchema.index({ title: "text", description: "text" });

const Course = model<ICourse>("Course", courseSchema);
export default Course;
