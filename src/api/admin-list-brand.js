import authorizedRequest from "../config/axios";

export const getAdminBrandApi = async () => {
  const response = await authorizedRequest.get("/admin/brand");
  return response;
};
