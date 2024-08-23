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

  const getAllByTeacherReference = async (id: string | null) => {
    try {
      const response = await courseInstance.get(
        `/get-all-by-teacher-reference/${id}`,
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

  const getCourseById = async (id: string | undefined) => {
    try {
      const response = await courseInstance.get(`/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  return { createCourse, getAll, getCourseById, getAllByTeacherReference };
};

export default useCourse;
