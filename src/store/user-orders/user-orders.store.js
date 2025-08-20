import { createSlice } from "@reduxjs/toolkit";
import { getUserProfileRequest } from "./profile.action";

const initialState = {
  orderList: null,
  loading: false,
  error: "",
};

export const profileSlide = createSlice({
  name: "orderList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileRequest.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUserProfileRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.profile = action.payload;
      })
      .addCase(getUserProfileRequest.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const profileAction = profileSlide.actions;

export default profileSlide.reducer;
