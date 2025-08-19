import authorizedRequest from "../config/axios";

export const deleteOrderApi = async (orderId) => {
  console.log("Deleting order with ID:", orderId);
  try {
    const response = await authorizedRequest.delete(`/admin/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const updateOrderStatusApi = async (orderId, newStatus) => {
  try {
    const response = await authorizedRequest.put(`/admin/orders/${orderId}`, {
      status: newStatus,
    });
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
