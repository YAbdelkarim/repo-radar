import Button from "@mui/material/Button";
import Refresh from "@mui/icons-material/Refresh";
import BookmarkRemoveOutlined from "@mui/icons-material/BookmarkRemoveOutlined";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RepoCard } from "../../components/RepoCard";
import {
  refreshTrackedRepo,
  selectRepoStatusById,
  selectTrackedRepoById,
  untrackRepo,
} from "./trackedReposSlice";

export function TrackedRepoCard({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const repo = useAppSelector((state) => selectTrackedRepoById(state, id));
  const status = useAppSelector((state) => selectRepoStatusById(state, id));

  if (!repo) return null;
  const loading = status?.loading ?? false;

  return (
    <RepoCard
      repo={repo}
      loading={loading}
      error={status?.error}
      actions={
        <>
          <Button
            size="small"
            startIcon={<Refresh />}
            disabled={loading}
            onClick={() => dispatch(refreshTrackedRepo({ id, fullName: repo.fullName }))}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<BookmarkRemoveOutlined />}
            onClick={() => dispatch(untrackRepo(id))}
          >
            Untrack
          </Button>
        </>
      }
    />
  );
}
