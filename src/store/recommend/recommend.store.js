import { createSlice } from "@reduxjs/toolkit";
import { getRecommendProductsApi } from "./recommend.action";

const initialState = {
  recommendProducts: null,
  loading: false,
  error: "",
};

const recommendSlice = createSlice({
  name: "recommend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendProductsApi.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getRecommendProductsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.recommendProducts = action.payload;
      })
      .addCase(getRecommendProductsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recommendSlice.reducer;
