import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile/profile.store";
import usersReducer from "./uses/users.store";
import listUserReducer from "./admin-list-user/admin-list-user.store";
import listBranReducer from "./admin-list-brand/admin-list-brand.store";
import listColorReducer from "./color-list/color-list.store";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    users: usersReducer,
    listUser: listUserReducer,
    listBrands: listBranReducer,
    listColors: listColorReducer,
  },
});

export default store;
