import authorizedRequest from "../config/axios";

export const getProductLatestProductByBrand = async (brandName) => {
  const response = await authorizedRequest.get("/products/latest", {
    params: { brandName },
  });
  return response;
};
