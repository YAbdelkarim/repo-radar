import Button from "@mui/material/Button";
import BookmarkAddOutlined from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAdded from "@mui/icons-material/BookmarkAdded";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { GithubRepo } from "../../types/github";
import { selectIsTracked, trackRepo, untrackRepo } from "./trackedReposSlice";

interface TrackButtonProps {
  repo: GithubRepo;
}

export function TrackButton({ repo }: TrackButtonProps) {
  const dispatch = useAppDispatch();
  const isTracked = useAppSelector((state) => selectIsTracked(state, repo.id));

  return (
    <Button
      size="small"
      variant={isTracked ? "outlined" : "contained"}
      startIcon={isTracked ? <BookmarkAdded /> : <BookmarkAddOutlined />}
      aria-pressed={isTracked}
      onClick={() => dispatch(isTracked ? untrackRepo(repo.id) : trackRepo(repo))}
    >
      {isTracked ? "Tracked" : "Track"}
    </Button>
  );
}
