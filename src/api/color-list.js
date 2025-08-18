import authorizedRequest from "../config/axios";

export const getColorListApi = async () => {
  try {
    const response = await authorizedRequest.get("/color");
    console.log("color", response);
    return response.data.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};
