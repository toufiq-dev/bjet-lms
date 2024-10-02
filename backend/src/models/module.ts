import { Schema, model, Document } from "mongoose";

export interface IModule extends Document {
  title: string;
  order: number;
  courseRef: Schema.Types.ObjectId;
  isPublished: boolean;
  lockUntil: Date;
  lessonRefs: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const moduleSchema: Schema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Module order is required"],
    },
    courseRef: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lessonRefs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Module = model<IModule>("Module", moduleSchema);
export default Module;
