import dayjs from "dayjs";
import moduleInstance from "../utils/moduleInstance";

const useModule = () => {
  const createModule = async (formData: {
    courseRef: string;
    title: string;
    lockUntil: dayjs.Dayjs;
  }) => {
    try {
      const response = await moduleInstance.post("/create", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  return { createModule };
};

export default useModule;
