import { createSlice } from '@reduxjs/toolkit';
import { getAllAdminBrandApiRq, getBrandsApiRq } from './brands.action';

const initialState = {
  listBrand: [],
  listBrandActive: null,
  loading: false,
  error: '',
};

export const listBrandSlide = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdminBrandApiRq.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getAllAdminBrandApiRq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.listBrand = action.payload.data;
      })
      .addCase(getAllAdminBrandApiRq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getBrandsApiRq.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getBrandsApiRq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.listBrandActive = action.payload.data;
      })
      .addCase(getBrandsApiRq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const listBrandAction = listBrandSlide.actions;

export default listBrandSlide.reducer;
