import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import institutesReducer from "../features/institutes/institutesSlice";
import coursesReducer from "../features/courses/coursesSlice";
import batchesReducer from "../features/batches/batchesSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    institutes: institutesReducer,
    courses: coursesReducer,
    batches: batchesReducer,
    dashboard: dashboardReducer,
  },
});
