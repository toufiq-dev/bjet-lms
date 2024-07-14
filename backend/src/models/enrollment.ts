import { Schema, model, Document } from "mongoose";

export interface IEnrollment extends Document {
  studentRef: Schema.Types.ObjectId;
  courseRef: Schema.Types.ObjectId;
  progressRef: Schema.Types.ObjectId;
  completedLessonsRef: Schema.Types.ObjectId[];
  enrolledAt: Date;
}

const enrollmentSchema: Schema = new Schema<IEnrollment>(
  {
    studentRef: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required"],
    },
    courseRef: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    progressRef: {
      type: Schema.Types.ObjectId,
      ref: "Progress",
      max: 100,
    },
    completedLessonsRef: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
export default Enrollment;
