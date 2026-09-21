import Button from "@mui/material/Button";
import Refresh from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { refreshAllTrackedRepos, selectIsAnyRefreshing } from "./trackedReposSlice";

export function RefreshAllButton() {
  const dispatch = useAppDispatch();
  const isRefreshing = useAppSelector(selectIsAnyRefreshing);

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<Refresh />}
      disabled={isRefreshing}
      onClick={() => dispatch(refreshAllTrackedRepos())}
    >
      {isRefreshing ? "Refreshing…" : "Refresh all"}
    </Button>
  );
}
