import { createSlice } from "@reduxjs/toolkit";
import { getAllAdminBrandApiRq } from "./admin-list-brand.action";

const initialState = {
  listBrand: null,
  loading: false,
  error: "",
};

export const listBrandSlide = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdminBrandApiRq.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllAdminBrandApiRq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listBrand = action.payload;
      })
      .addCase(getAllAdminBrandApiRq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const listBrandAction = listBrandSlide.actions;

export default listBrandSlide.reducer;
