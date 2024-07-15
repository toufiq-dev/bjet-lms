import axios from "axios";
import responseInterceptor from "./axiosInterceptors";

const courseInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/courses`,
  withCredentials: true,
  timeout: 10000,
});

responseInterceptor(courseInstance);

export default courseInstance;
