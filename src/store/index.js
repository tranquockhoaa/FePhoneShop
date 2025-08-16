import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profile/profile.store';
import usersReducer from './uses/users.store';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    users: usersReducer,
  },
});

export default store;
