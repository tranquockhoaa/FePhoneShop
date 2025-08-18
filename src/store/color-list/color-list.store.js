import { createSlice } from "@reduxjs/toolkit";
import { getColorListApiRq } from "./color-list.action";
const initialState = {
  listColor: null,
  loading: false,
  error: "",
};

export const listColorSlide = createSlice({
  name: "list-color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getColorListApiRq.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getColorListApiRq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listColor = action.payload;
      })
      .addCase(getColorListApiRq.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const listColorAction = listColorSlide.actions;

export default listColorSlide.reducer;
