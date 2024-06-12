import { configureStore } from "@reduxjs/toolkit";
import { clinicApi } from "./doctorApi";
import { userApi } from "./userApi"; // Import the userApi

const store = configureStore({
  reducer: {
    [clinicApi.reducerPath]: clinicApi.reducer,
    [userApi.reducerPath]: userApi.reducer, // Add userApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clinicApi.middleware, userApi.middleware), // Add userApi middleware
});

export default store;