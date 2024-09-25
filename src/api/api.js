import axios from "axios";
import { getToken } from "./payload";

// const baseUrl = "https://backend-production-f9e7.up.railway.app/api/v1/"
const baseUrl = "http://128.199.72.163:9000/api/v1/";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiWithAuth = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  },
});

export {
  api,
  apiWithAuth
};
