// api/recommend.js
import authorizedRequest from "../config/axios";

export const getRecommendProduct = async (code) => {
  console.log("API đang chạy...");

  const response = await authorizedRequest.get(`/products/recommend/${code}`);

  return response.data;
};
