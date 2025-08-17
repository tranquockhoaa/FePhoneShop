import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListUserApi } from "../../api/admin-list-users";

export const getListUserApiRequest = createAsyncThunk(
  "/admin/users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getListUserApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi API");
    }
  }
);
