import mongoose, { Schema, model, Document } from "mongoose";

export interface ILesson extends Document {
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  order: number;
  moduleRef: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const lessonSchema: Schema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    content: {
      type: String,
      maxlength: [200, "Character limit exceeded"],
    },
    order: {
      type: Number,
      required: true,
    },
    moduleRef: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;
