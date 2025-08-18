import axios from "axios";

// Create a default axios instance for user APIs (if needed)
const userAxios = axios.create({
  // baseURL: "http://localhost:3000/api/v1/user",
});

export default userAxios;
