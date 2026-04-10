import authorizedRequest from "../config/axios";

export const getDashboard = async (query) => {
  try {
    const response = await authorizedRequest.get(`/admin/dashboard?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};

export const getBestselling = async () => {
  try {
    const response = await authorizedRequest.get(
      `/admin/dashboard/best-selling`,
    );
    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};

export const getProductInventoryReport = async (query) => {
  try {
    const response = await authorizedRequest.get(
      `/admin/dashboard/product-inventory-report?${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error get product inventory report:", error);
    throw error;
  }
};

export const getTotalUser = async () => {
  try {
    const response = await authorizedRequest.get(`/admin/dashboard/total-user`);
    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};
