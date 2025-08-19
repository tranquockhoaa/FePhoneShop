import authorizedRequest from "../config/axios";

export const getAllOrderUserApi = async (params = {}) => {
  try {
    const response = await authorizedRequest.get("/order", { params });
    return response.data;
  } catch (error) {
    console.error("Error getAllOrderUserApi:", error);
    throw error;
  }
};

export const getOrderDetailApi = async (orderId) => {
  console.log("get order-detail");
  try {
    const response = await authorizedRequest.get(`/order/${orderId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
  }
};
