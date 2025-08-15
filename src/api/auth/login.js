import authorizedRequest from "../config/axios";

export const login = async (brandName) => {
  const response = await authorizedRequest.get("/products/latest", {
    params: { brandName },
  });
  return response;
};

const getInfoAccountApi = async (email){
    
}
