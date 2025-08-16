import { createSlice } from "@reduxjs/toolkit";
import { getUserProfileApiRq } from "./profile.action";

const initialState = {
  profile: {},
  loading: false,
  error: "",
};

export const profileSlide = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileApiRq.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUserProfileApiRq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.profile = action.payload;
      })
      .addCase(getUserProfileApiRq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const profileAction = profileSlide.actions;

export default profileSlide.reducer;
