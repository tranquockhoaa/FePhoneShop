import axios from "axios";
import { stringify } from "qs";
import getToken from "./token";
import { CONFIG } from "../config/env";

const authorizedRequest = axios.create({
  baseURL: CONFIG.BASE_URL + CONFIG.BASE_URL_VERSION,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return stringify(params, { arrayFormat: "repeat" });
  },
});

authorizedRequest.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Cache-Control"] = "no-cache";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";
  return config;
});

authorizedRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("account");
    }
    return Promise.reject(error?.response);
  },
);
export default authorizedRequest;
