import { createSlice } from "@reduxjs/toolkit";
import { getListUserApiRequest } from "./admin-list-user.action";

const initialState = {
  listUser: [],
  loading: false,
  error: "",
};

export const listUserSlide = createSlice({
  name: "admin/users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListUserApiRequest.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getListUserApiRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listUser = action.payload;
      })
      .addCase(getListUserApiRequest.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const listUserAction = listUserSlide.actions;

export default listUserSlide.reducer;
