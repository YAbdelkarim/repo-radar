import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getRepo } from "../../api/repos";
import { toTrackedRepo } from "../../api/mappers";
import { loadTrackedRepos } from "./storage";
import type { GithubRepo } from "../../types/github";
import type { TrackedRepo } from "../../types/repo";

interface RefreshArgs {
  id: number;
  fullName: string; // "owner/name"
}

export const refreshTrackedRepo = createAsyncThunk(
  "trackedRepos/refresh",
  async ({ fullName }: RefreshArgs) => {
    const [owner, name] = fullName.split("/");
    return toTrackedRepo(await getRepo(owner, name));
  },
);

interface RepoStatus {
  loading: boolean;
  error: string | null;
}

export interface TrackedReposState {
  entities: Record<number, TrackedRepo>;
  ids: number[];
  statusById: Record<number, RepoStatus>;
}

function stateFromRepos(repos: TrackedRepo[]): TrackedReposState {
  const state: TrackedReposState = { entities: {}, ids: [], statusById: {} };
  for (const repo of repos) {
    state.entities[repo.id] = repo;
    state.ids.push(repo.id);
    state.statusById[repo.id] = { loading: false, error: null };
  }
  return state;
}

// Hydrated synchronously from localStorage, so the first render already has the data (no flash)
const initialState: TrackedReposState = stateFromRepos(loadTrackedRepos());

const trackedReposSlice = createSlice({
  name: "trackedRepos",
  initialState,
  reducers: {
    trackRepo: {
      reducer(state, action: PayloadAction<TrackedRepo>) {
        const repo = action.payload;
        if (!state.entities[repo.id]) state.ids.push(repo.id);
        state.entities[repo.id] = repo;
        state.statusById[repo.id] = { loading: false, error: null };
      },
      // Components dispatch trackRepo(githubRepo); mapping happens here, once
      prepare(repo: GithubRepo) {
        return { payload: toTrackedRepo(repo) };
      },
    },
    untrackRepo(state, action: PayloadAction<number>) {
      const id = action.payload;
      delete state.entities[id];
      delete state.statusById[id];
      state.ids = state.ids.filter((existingId) => existingId !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTrackedRepo.pending, (state, action) => {
        const status = state.statusById[action.meta.arg.id];
        if (!status) return; // untracked mid-flight
        status.loading = true;
        status.error = null;
      })
      .addCase(refreshTrackedRepo.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        if (!state.entities[id]) return; // untracked mid-flight: don't re-add it
        state.entities[id] = action.payload;
        state.statusById[id] = { loading: false, error: null };
      })
      .addCase(refreshTrackedRepo.rejected, (state, action) => {
        const status = state.statusById[action.meta.arg.id];
        if (!status) return;
        status.loading = false;
        status.error = action.error.message ?? "Failed to refresh repository";
      });
  },
});

export const { trackRepo, untrackRepo } = trackedReposSlice.actions;
export default trackedReposSlice.reducer;
