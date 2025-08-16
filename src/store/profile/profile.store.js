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
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
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
