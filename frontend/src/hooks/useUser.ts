import userInstance from "../utils/userInstance";

const useUser = () => {
  const signIn = async (formData: { email: string; password: string }) => {
    try {
      const response = await userInstance.post("/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const signOut = async () => {
    try {
      const response = await userInstance.post("/signout");
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const changePassword = async (formData: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await userInstance.post("/change-password", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const createStudents = async (emails: string[]) => {
    try {
      const response = await userInstance.post("/register-students", emails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: error };
    }
  };

  const createTeachers = async (teacherData: { email: string; password: string; role: string }) => {
    try {
      const response = await userInstance.post("/register", teacherData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return { error: (error as any).response ? (error as any).response.data : (error as any).message };
    }
  };

  return { signIn, signOut, changePassword, createStudents, createTeachers };
};

export default useUser;
