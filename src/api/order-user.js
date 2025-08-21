import authorizedRequest from "../config/axios";

export const getAllOrderUserApi = async (params = {}) => {
  try {
    const response = await authorizedRequest.get("/order", {
      params: {
        sortBy: "createAt",
        sortOrder: "DESC",
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getAllOrderUserApi:", error);
    throw error;
  }
};

export const getOrderDetailApi = async (orderId) => {
  try {
    const response = await authorizedRequest.get(`/order/${orderId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
  }
};

export const cancelOrderApi = async (orderId) => {
  console.log("cancelOrder", orderId);
  try {
    const response = await authorizedRequest.put(`/order/${orderId}`, {
      status: "CANCELLED",
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
