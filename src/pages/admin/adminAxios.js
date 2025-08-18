import axios from "axios";

// Create an axios instance for admin APIs
const adminAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1/admin",
});

// Add a request interceptor to attach the Authorization token
adminAxios.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or another secure place)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log(token)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminAxios;
