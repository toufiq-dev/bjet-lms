import lessonInstance from "../utils/lessonInstance";

const useLesson = () => {
  const createLesson = async (formData: FormData) => {
    try {
      const response = await lessonInstance.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const updateLessonTitle = async (lessonId: string, newTitle: string) => {
    try {
      const response = await lessonInstance.patch(`/${lessonId}`, { title: newTitle });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const response = await lessonInstance.delete(`/${lessonId}`);
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  return { createLesson, updateLessonTitle, deleteLesson };
};

export default useLesson;
