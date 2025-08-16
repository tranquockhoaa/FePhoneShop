import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllAdminBrandApi } from "../../api/admin-list-brand";

export const getAllAdminBrandApiRq = createAsyncThunk(
  "admin/brand",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAdminBrandApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi API");
    }
  }
);
