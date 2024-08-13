import courseInstance from "../utils/courseInstance";

const useCourse = () => {
  const createCourse = async (formData: {
    teacherRef: string | null;
    title: string;
    description: string;
  }) => {
    try {
      const response = await courseInstance.post("/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const getAll = async () => {
    try {
      const response = await courseInstance.get("/all", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const getCourseById = async (id: string | undefined) => {
    try {
      const response = await courseInstance.get(
        `/view-course-by-reference/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  return { createCourse, getAll, getCourseById };
};

export default useCourse;
