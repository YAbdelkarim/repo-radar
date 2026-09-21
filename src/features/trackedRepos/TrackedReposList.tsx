import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/hooks";
import { RepoGrid } from "../../components/RepoGrid";
import { SortSelect } from "../../components/SortSelect";
import { RefreshAllButton } from "./RefreshAllButton";
import { TrackedRepoCard } from "./TrackedRepoCard";
import { TRACKED_SORT_OPTIONS, type TrackedSortOption } from "./sorting";
import { selectSortedTrackedIds } from "./trackedReposSlice";

export function TrackedReposList() {
  const [sort, setSort] = useState<TrackedSortOption>("added");
  const ids = useAppSelector((state) => selectSortedTrackedIds(state, sort));

  if (ids.length === 0) {
    return (
      <Typography color="text.secondary">
        You're not tracking any repositories yet. Search for one and click "Track" to add it here.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
      >
        <Typography variant="body2" color="text.secondary">
          Tracking {ids.length} {ids.length === 1 ? "repository" : "repositories"}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <SortSelect
            size="small"
            value={sort}
            options={TRACKED_SORT_OPTIONS}
            onChange={setSort}
          />
          <RefreshAllButton />
        </Stack>
      </Stack>

      <RepoGrid>
        {ids.map((id) => (
          <TrackedRepoCard key={id} id={id} />
        ))}
      </RepoGrid>
    </Stack>
  );
}
