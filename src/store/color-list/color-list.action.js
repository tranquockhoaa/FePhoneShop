import { createAsyncThunk } from "@reduxjs/toolkit";
import { getColorListApi } from "../../api/color-list";

export const getColorListApiRq = createAsyncThunk(
  "get/color",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getColorListApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi API");
    }
  }
);
