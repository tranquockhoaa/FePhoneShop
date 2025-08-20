import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllAdminBrandApi,
  getAllClientBrandApi,
} from '../../api/brands.api';

export const getAllAdminBrandApiRq = createAsyncThunk(
  'admin/brand',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAdminBrandApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi API');
    }
  }
);

export const getBrandsApiRq = createAsyncThunk(
  'client/brands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllClientBrandApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi API');
    }
  }
);
