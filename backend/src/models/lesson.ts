import { Schema, model, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content: {
    type: "text" | "file";
    data: string;
  };
  order: number;
  moduleRef: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema: Schema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      index: true,
    },
    content: {
      type: {
        type: String,
        enum: ["text", "file"],
        required: true,
      },
      data: {
        type: String,
        required: true,
      },
    },
    order: {
      type: Number,
      required: true,
    },

    moduleRef: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Module reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

lessonSchema.index({ title: "text", content: "text" });

const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;
