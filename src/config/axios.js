import axios from "axios";
import { stringify } from "qs";
import getToken from "./token";

const authorizedRequest = axios.create({
  baseURL: "http://localhost:3000/api/v1",
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
  return config;
});

export default authorizedRequest;
