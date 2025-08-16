import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile.store";

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export default store;
