// store/recommend/recommend.action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecommendProduct } from "../../api/recommend";

export const getRecommendProductsApi = createAsyncThunk(
  "recommend/getProducts",
  async (code, { rejectWithValue }) => {
    try {
      const data = await getRecommendProduct(code);

      // ✅ chỉ lấy mảng cần dùng
      return data.recommendations.map((item) => ({
        ...item,
        total_views: Number(item.total_views), // convert luôn
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Lỗi API",
      );
    }
  },
);
