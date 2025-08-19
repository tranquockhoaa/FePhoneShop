import authorizedRequest from '../config/axios';
import { MEDIA_UPLOAD } from './endpoint';

export const mediaUploadApi = async (body) => {
  try {
    let requestBody = body;
    let headers = {
      'Content-Type': 'multipart/form-data',
    };

    if (body.image && body.image instanceof File) {
      const formData = new FormData();
      formData.append('image', body.image);
      requestBody = formData;
    }

    const response = await authorizedRequest.post(MEDIA_UPLOAD, requestBody, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error mediaUploadApi:', error);
    throw error;
  }
};

export const getMediaApi = async (id) => {
  try {
    const response = await authorizedRequest.get(`/media/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getMediaApi:', error);
    throw error;
  }
};
