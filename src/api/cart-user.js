import authorizedRequest from "../config/axios";

export const getCartDetailApi = async () => {
  try {
    const response = await authorizedRequest.get("/cart-detail");
    return response.data;
  } catch (error) {
    console.error("Error get list cart-details:", error);
    throw error;
  }
};

export const handleIncreaseApi = async (product_detail_id) => {
  try {
    const response = await authorizedRequest.patch(
      "/cart-detail/increase-quantity",
      { product_detail_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error api", error);
    throw error;
  }
};

export const handleDecreaseApi = async (product_detail_id) => {
  try {
    const response = await authorizedRequest.patch(
      "/cart-detail/decrease-quantity",
      { product_detail_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error api", error);
    throw error;
  }
};

export const handleRemoveProductApi = async (product_detail_id) => {
  try {
    const response = await authorizedRequest.delete(
      "/cart-detail/remove-product",
      { data: { product_detail_id } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error api: " + error.message);
  }
};

export const clearCart = async () => {
  try {
    const response = await authorizedRequest.delete("/cart-detail/clear-cart");
    return response.data;
  } catch (error) {
    throw new Error("Error api: " + error.message);
  }
};

export const createCart = async (id) => {
  try {
    const response = await authorizedRequest.post("/cart", { id });
    return response.data;
  } catch (error) {
    throw new Error("Error api: " + error.message);
  }
};
