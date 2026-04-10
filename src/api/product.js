import authorizedRequest from "../config/axios";

export const getProductById = async (code) => {
  try {
    const response = await authorizedRequest.get(`/products/${code}`);
    return response;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
