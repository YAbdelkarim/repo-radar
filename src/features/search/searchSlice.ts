import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchRepos } from "../../api/repos";
import type { GithubRepo, RepoSearchSort } from "../../types/github";

interface SearchParams {
  query: string;
  page: number;
  perPage: number;
  sort?: RepoSearchSort;
}

export const fetchSearchResults = createAsyncThunk("search/fetch", async (params: SearchParams) => {
  const result = await searchRepos(params.query, params.perPage, params.page, params.sort);
  return result;
});

interface SearchState {
  items: GithubRepo[];
  totalCount: number;
  pagination: { hasPrev: boolean; hasNext: boolean; lastPage: number | null };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchState = {
  items: [],
  totalCount: 0,
  pagination: { hasPrev: false, hasNext: false, lastPage: null },
  status: "idle",
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Search Failed";
      });
  },
});

export default searchSlice.reducer;
