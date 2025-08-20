import authorizedRequest from '../config/axios';

export const getAllAdminBrandApi = async () => {
  const response = await authorizedRequest.get('/admin/brand');
  return response;
};

export const getAllClientBrandApi = async () => {
  const response = await authorizedRequest.get('/brand');
  return response;
};
