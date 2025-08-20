import authorizedRequest from "../config/axios";
import {
  LOGIN,
  LOGOUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  USER,
} from "./endpoint";

export const logoutApi = async () => {
  try {
    const response = await authorizedRequest.post(LOGOUT);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const loginApi = async (body) => {
  try {
    const response = await authorizedRequest.post(LOGIN, body);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const forgotPasswordApi = async (body) => {
  try {
    const response = await authorizedRequest.post(FORGOT_PASSWORD, body);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const updateUserApi = async ({ id, body }) => {
  try {
    const response = await authorizedRequest.post(`${USER}/:${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const resetPasswordApi = async (body) => {
  try {
    const response = await authorizedRequest.post(RESET_PASSWORD, body);
    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const getUserProfileApi = async () => {
  try {
    const response = await authorizedRequest.get("user/profile");

    return response;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await authorizedRequest.put("user/change-password", {
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Error searching profile:", error);
    throw error;
  }
};
