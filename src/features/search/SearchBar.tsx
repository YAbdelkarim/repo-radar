import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useAppDispatch } from "../../app/hooks";
import { useDebounce } from "../../hooks/useDebounce";
import { clearSearch, fetchSearchResults } from "./searchSlice";
import { SortSelect } from "./SortSelect";
import { SEARCH_DEBOUNCE_MS, SEARCH_PER_PAGE, toApiSort, type SortOption } from "./constants";

export function SearchBar() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("best-match");
  const debouncedQuery = useDebounce(input.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedQuery) {
      dispatch(clearSearch());
      return;
    }
    dispatch(
      fetchSearchResults({
        query: debouncedQuery,
        page: 1,
        perPage: SEARCH_PER_PAGE,
        sort: toApiSort(sortOption),
      }),
    );
  }, [debouncedQuery, sortOption, dispatch]);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      {" "}
      <TextField
        fullWidth
        label="Search GitHub repositories"
        placeholder="e.g. react, tensorflow"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: input ? (
              <InputAdornment position="end">
                <IconButton aria-label="Clear search" edge="end" onClick={() => setInput("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <SortSelect value={sortOption} onChange={setSortOption} />
    </Stack>
  );
}
