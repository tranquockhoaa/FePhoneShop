import { createSlice } from '@reduxjs/toolkit';
import { getUserProfileRequest } from './users.action';

const initialState = {
  profile: null,
  loading: false,
  error: '',
};

export const usersSlide = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileRequest.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getUserProfileRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.profile = action.payload;
      })
      .addCase(getUserProfileRequest.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const profileAction = usersSlide.actions;

export default usersSlide.reducer;
