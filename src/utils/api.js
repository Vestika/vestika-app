import axios from "axios";
import { FireGetToken } from "@/utils/firebase";

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

api.interceptors.request.use(
  async request => {
    request.headers.Authorization = `Bearer ${await FireGetToken()}`;
    console.info(
      request.method.toUpperCase(),
      request.baseURL + request.url,
      request.data || "",
    );
    return request;
  },
  error => {
    console.error(error);
    throw error;
  },
);

api.interceptors.response.use(
  response => {
    console.log(response);
    return response.data;
  },
  error => {
    console.error(
      `${error.response.config.method.toUpperCase()} %s %s`,
      error.response.request.responseURL,
      error.response.status,
      error.response.data,
    );
    throw error;
  },
);

export default api;
