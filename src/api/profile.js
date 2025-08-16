import authorizedRequest from "../config/axios";

export const getUserProfileApi = async () => {
  try {
    const response = await authorizedRequest.get("user/profile");
    console.log(response.data.data);
    return response;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};
