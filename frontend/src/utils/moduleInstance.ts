import axios from "axios";
import responseInterceptor from "./axiosInterceptors";

const moduleInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/modules`,
  withCredentials: true,
  timeout: 10000,
});

responseInterceptor(moduleInstance);

export default moduleInstance;
