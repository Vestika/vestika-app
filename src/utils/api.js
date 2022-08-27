import axios from "axios";
import { FireGetToken } from "@/utils/firebase";

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

api.interceptors.request.use(
  async request => {
    console.log(request.method.toUpperCase(), request.url);
    request.headers.Authorization = `Bearer ${await FireGetToken()}`;
    return request;
  },
  error => {
    console.error(error);
    throw error;
  },
);

api.interceptors.response.use(
  response => {
    if (response == undefined) {
      console.log("No Response");
      return response;
    }
    console.log(
      `${response.config.method.toUpperCase()} %s %s`,
      response.request.responseURL,
      response.status,
      response.data,
    );
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
