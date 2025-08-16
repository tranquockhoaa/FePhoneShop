import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfileApi } from "../../api/profile";

export const getUserProfileApiRq = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfileApi();
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi API");
    }
  }
);
