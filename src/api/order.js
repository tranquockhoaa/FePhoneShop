import authorizedRequest from "../config/axios";

export const createPayment = async (data) => {
  try {
    const response = await authorizedRequest.post("/order/create-payment", data);

    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};


export const checkPaymentApi = async (query) => {
  try {
    const response = await authorizedRequest.get(`/order/check-payment-vnpay${query}`);

    return response.data;
  } catch (error) {
    console.error("Error get list users:", error);
    throw error;
  }
};
