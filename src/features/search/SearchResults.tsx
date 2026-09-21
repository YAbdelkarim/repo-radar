import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toTrackedRepo } from "../../api/mappers";
import { RepoCard } from "../../components/RepoCard";
import { RepoCardSkeleton } from "../../components/RepoCardSkeleton";
import { RepoGrid } from "../../components/RepoGrid";
import { formatFull } from "../../utils/format";
import { fetchSearchResults } from "./searchSlice";
import { SEARCH_PER_PAGE } from "./constants";
import { SearchPagination } from "./SearchPagination";
import { TrackButton } from "../trackedRepos/TrackButton"; // NEW import

export function SearchResults() {
  const dispatch = useAppDispatch();
  const { items, totalCount, params, status, error } = useAppSelector((state) => state.search);

  // 1. Nothing searched yet
  if (status === "idle") {
    return <Typography color="text.secondary">Search for a repository to get started.</Typography>;
  }

  // 2. Request failed
  if (status === "failed") {
    return (
      <Alert
        severity="error"
        action={
          params && (
            <Button
              color="inherit"
              size="small"
              onClick={() => dispatch(fetchSearchResults(params))}
            >
              Retry
            </Button>
          )
        }
      >
        {error}
      </Alert>
    );
  }

  // 3. First load: nothing to show yet
  if (status === "loading" && items.length === 0) {
    return (
      <RepoGrid>
        {Array.from({ length: SEARCH_PER_PAGE }, (_, i) => (
          <RepoCardSkeleton key={i} />
        ))}
      </RepoGrid>
    );
  }

  // 4. Search worked but found nothing
  if (status === "succeeded" && items.length === 0) {
    return <Typography color="text.secondary">No repositories match "{params?.query}".</Typography>;
  }

  // 5. Results, possibly being replaced by a new request
  const isRefetching = status === "loading";

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {formatFull(totalCount)} repositories found
        {totalCount > 1000 && " (GitHub returns the first 1,000)"}
      </Typography>
      <LinearProgress sx={{ visibility: isRefetching ? "visible" : "hidden" }} />
      <Box
        aria-busy={isRefetching}
        sx={{ opacity: isRefetching ? 0.5 : 1, transition: "opacity 150ms" }}
      >
        <RepoGrid>
          {items.map((item) => (
            <RepoCard
              key={item.id}
              repo={toTrackedRepo(item)}
              actions={<TrackButton repo={item} />}
            />
          ))}
        </RepoGrid>
      </Box>
      <SearchPagination />
    </Stack>
  );
}
