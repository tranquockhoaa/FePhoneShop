import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrderUserApi } from "../../api/order-user";

export const getAllOrderUserApiRequest = createAsyncThunk(
  "get/allOrderUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrderUserApi();
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi API");
    }
  }
);
