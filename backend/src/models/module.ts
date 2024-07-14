import { Schema, model, Document } from "mongoose";

export interface IModule extends Document {
  title: string;
  description: string;
  order: number;
  courseRef: Schema.Types.ObjectId;
  lessonRefs: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema: Schema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Module description is required"],
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

moduleSchema.index({ title: "text", description: "text" });

const Module = model<IModule>("Module", moduleSchema);
export default Module;
