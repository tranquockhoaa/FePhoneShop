import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUsersApi } from '../../api/users.api';

export const getUsersRequest = createAsyncThunk(
  'users/getUsersRequest',
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUsersApi(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi API');
    }
  }
);
