import axios from "axios";
import responseInterceptor from "./axiosInterceptors";

const userInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/users`,
  withCredentials: true,
  timeout: 10000,
});

responseInterceptor(userInstance);

export default userInstance;
