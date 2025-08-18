import { createSlice } from '@reduxjs/toolkit';
import { getUsersRequest } from './users.action';

const initialState = {
  listUsers: null,
  loading: false,
  error: '',
};

export const usersSlide = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.listUsers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersRequest.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUsersRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.listUsers = action.payload;
      })
      .addCase(getUsersRequest.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const usersAction = usersSlide.actions;

export default usersSlide.reducer;
