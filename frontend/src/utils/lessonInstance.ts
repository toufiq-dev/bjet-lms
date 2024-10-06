import axios from "axios";
import responseInterceptor from "./axiosInterceptors";

const lessonInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/lessons`,
  withCredentials: true,
  timeout: 10000,
});

responseInterceptor(lessonInstance);

export default lessonInstance;
