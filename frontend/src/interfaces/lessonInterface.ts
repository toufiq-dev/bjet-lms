export interface Lesson {
  _id: string;
  title: string;
  content: string; // URL or path to the lesson content
  order: number; // Lesson order in the module
  moduleRef: string; // Reference to the module this lesson belongs to
}
