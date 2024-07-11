import { Schema, model, Document } from "mongoose";

export interface IProgress extends Document {
  enrollmentRef: Schema.Types.ObjectId;
  moduleProgress: {
    moduleRef: Schema.Types.ObjectId;
    completed: boolean;
    lessonProgress: {
      lessonRef: Schema.Types.ObjectId;
      completed: boolean;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema: Schema = new Schema<IProgress>(
  {
    enrollmentRef: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    moduleProgress: [
      {
        moduleRef: {
          type: Schema.Types.ObjectId,
          ref: "Module",
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        lessonProgress: [
          {
            lessonRef: {
              type: Schema.Types.ObjectId,
              ref: "Lesson",
              required: true,
            },
            completed: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Progress = model<IProgress>("Progress", progressSchema);
export default Progress;
