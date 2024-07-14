import { AxiosInstance } from "axios";
import { store } from "../redux/store";
import { removeSignIn } from "../redux/slices/userSlice";
import userInstance from "./userInstance";

const responseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response.data.message === "Refresh token required" ||
        error.response.data.message === "Invalid refresh token"
      ) {
        store.dispatch(removeSignIn());
      } else if (
        error.response.data.message === "Authentication required" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          await userInstance.post("/refresh-token");
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default responseInterceptor;
