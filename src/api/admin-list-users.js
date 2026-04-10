import authorizedRequest from "../config/axios";

export const getListUserApi = async () => {
  try {
    const response = await authorizedRequest.get("/admin/users");
    return response.data.users;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};
