import { Lesson } from "./lessonInterface";

export interface Module {
  _id: string;
  title: string;
  order: number;
  lockUntil: string; // Use string if the date is in ISO format
  isPublished: boolean;
  lessonRefs?: Lesson[]; // Optional array of lessons in the module
}
