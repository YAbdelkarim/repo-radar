import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../features/search/searchSlice";
import trackedReposReducer from "../features/trackedRepos/trackedReposSlice";
import { persistenceMiddleware } from "./persistenceMiddleware";

export const store = configureStore({
  reducer: { search: searchReducer, trackedRepos: trackedReposReducer },
  middleware: (getDefault) => getDefault().concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
