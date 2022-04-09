import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/userSlice";

export const store = configureStore({
   reducer: {
      user: userReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            // Ignore these action types
            ignoredActions: ["your/action/type"],
            // Ignore these field paths in all actions
            ignoredActionPaths: ["payload"],
            // Ignore these paths in the state
            ignoredPaths: ["user.user"],
         },
      }),
});
