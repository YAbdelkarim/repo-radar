// features/trackedRepos/TrackedReposList.tsx
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/hooks";
import { RepoGrid } from "../../components/RepoGrid";
import { RefreshAllButton } from "./RefreshAllButton";
import { TrackedRepoCard } from "./TrackedRepoCard";
import { selectTrackedIds } from "./trackedReposSlice";

export function TrackedReposList() {
  const ids = useAppSelector(selectTrackedIds);

  if (ids.length === 0) {
    return (
      <Typography color="text.secondary">
        You're not tracking any repositories yet. Search for one and click "Track" to add it here.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Tracking {ids.length} {ids.length === 1 ? "repository" : "repositories"}
        </Typography>
        <RefreshAllButton />
      </Stack>

      <RepoGrid>
        {ids.map((id) => (
          <TrackedRepoCard key={id} id={id} />
        ))}
      </RepoGrid>
    </Stack>
  );
}
