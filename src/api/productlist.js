import authorizedRequest from "../config/axios";

export const searchProductByBrandName = async (brandName, page, sortOrder) => {
  const PAGE_SIZE = 10;
  try {
    const response = await authorizedRequest.get(
      `/products/search?brandName=${brandName}&_page=${page}&_limit=${PAGE_SIZE}${
        sortOrder ? `&sortPrice=${sortOrder}` : ""
      }`
    );
    return response;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
