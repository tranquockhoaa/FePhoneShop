import authorizedRequest from '../config/axios';
import { LOGIN, LOGOUT, CREATE_USER, ADMIN_USER, USER } from './endpoint';

export const getUsersApi = async (params) => {
  try {
    const response = await authorizedRequest.get(ADMIN_USER, { params });
    return response.data;
  } catch (error) {
    console.error('Error getUsersApi:', error);
    throw error;
  }
};

export const updateUserApi = async ({ id, body }) => {
  try {
    const response = await authorizedRequest.patch(`${USER}/${id}`, body);
    return response.data;
  } catch (error) {
    console.error('Error updateUserApi:', error);
    throw error;
  }
};

export const createUserApi = async (body) => {
  try {
    const response = await authorizedRequest.post(CREATE_USER, body);
    return response.data;
  } catch (error) {
    console.error('Error createUserApi:', error);
    throw error;
  }
};
