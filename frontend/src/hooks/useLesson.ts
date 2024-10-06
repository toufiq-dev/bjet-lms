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

  return { createLesson };
};

export default useLesson;
