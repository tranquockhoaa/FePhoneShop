import authorizedRequest from '../config/axios';

export const getProductLatestProductByBrand = async (params) => {
  const response = await authorizedRequest.get('/products/latest', {
    params,
  });
  return response;
};
