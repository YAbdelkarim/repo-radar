import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchRepos } from "../../api/repos";
import { toErrorMessage } from "../../api/error";
import type { RepoSearchResult, RepoSearchSort } from "../../types/github";

export interface SearchParams {
  query: string;
  page: number;
  perPage: number;
  sort?: RepoSearchSort;
}

export const fetchSearchResults = createAsyncThunk<
  RepoSearchResult,
  SearchParams,
  { rejectValue: string }
>("search/fetch", async ({ query, perPage, page, sort }, { rejectWithValue }) => {
  try {
    return await searchRepos(query, perPage, page, sort);
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

interface SearchState extends RepoSearchResult {
  params: SearchParams | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentRequestId: string | null;
}

const initialState: SearchState = {
  items: [],
  totalCount: 0,
  pagination: { hasPrev: false, hasNext: false, lastPage: null },
  params: null,
  status: "idle",
  error: null,
  currentRequestId: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
        state.params = action.meta.arg;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return; // stale response
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return; // stale response
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Search failed";
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
