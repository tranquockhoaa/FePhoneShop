import authorizedRequest from '../config/axios';
import { LOGIN ,LOGOUT} from './endpoint';

export const logoutApi = async () => {
  try {
    const response = await authorizedRequest.post(LOGOUT);
    return response.data;
  } catch (error) {
    console.error('Error searching profile:', error);
    throw error;
  }
};

export const loginApi = async (body) => {
  try {
    const response = await authorizedRequest.post(LOGIN, body);
    return response.data;
  } catch (error) {
    console.error('Error searching profile:', error);
    throw error;
  }
};

export const getUserProfileApi = async () => {
  try {
    const response = await authorizedRequest.get('user/profile');

    return response;
  } catch (error) {
    console.error('Error searching profile:', error);
    throw error;
  }
};
