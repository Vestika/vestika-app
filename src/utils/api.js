import axios from "axios";
import { FireGetToken } from "@/utils/firebase";

const options = {};
const api = axios.create(options);

api.interceptors.request.use(
  async request => {
    console.log(request.method.toUpperCase(), request.url);
    request.headers.Authorization = `Bearer ${await FireGetToken()}`;
    return request;
  },
  error => {
    console.error(error.response.status, error.response.data);
    throw error;
  },
);

api.interceptors.response.use(
  response => {
    console.log(response);
    return response.data;
  },
  error => {
    console.error(error.response.status, error.response.data);
    throw error;
  },
);

export default api;
