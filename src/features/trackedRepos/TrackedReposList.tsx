import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BookmarkRemoveOutlined from "@mui/icons-material/BookmarkRemoveOutlined";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RepoCard } from "../../components/RepoCard";
import { RepoGrid } from "../../components/RepoGrid";
import { selectTrackedRepos, untrackRepo } from "./trackedReposSlice";

export function TrackedReposList() {
  const dispatch = useAppDispatch();
  const repos = useAppSelector(selectTrackedRepos);

  if (repos.length === 0) {
    return (
      <Typography color="text.secondary">
        You're not tracking any repositories yet. Search for one and click "Track" to add it here.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Tracking {repos.length} {repos.length === 1 ? "repository" : "repositories"}
      </Typography>
      <RepoGrid>
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            actions={
              <Button
                size="small"
                color="error"
                startIcon={<BookmarkRemoveOutlined />}
                onClick={() => dispatch(untrackRepo(repo.id))}
              >
                Untrack
              </Button>
            }
          />
        ))}
      </RepoGrid>
    </Stack>
  );
}
