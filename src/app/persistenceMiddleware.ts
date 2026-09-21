import { isAnyOf, type Middleware } from "@reduxjs/toolkit";
import {
  trackRepo,
  untrackRepo,
  refreshTrackedRepo,
  type TrackedReposState,
} from "../features/trackedRepos/trackedReposSlice";
import { saveTrackedRepos } from "../features/trackedRepos/storage";

const shouldPersist = isAnyOf(trackRepo, untrackRepo, refreshTrackedRepo.fulfilled);

export const persistenceMiddleware: Middleware = (api) => (next) => (action) => {
  const result = next(action);
  if (shouldPersist(action)) {
    const { trackedRepos } = api.getState() as {
      trackedRepos: TrackedReposState;
    };
    saveTrackedRepos(trackedRepos.ids.map((id) => trackedRepos.entities[id]));
  }
  return result;
};
