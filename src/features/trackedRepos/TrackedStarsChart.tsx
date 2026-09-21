import { lazy, Suspense } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/hooks";
import { selectTrackedRepos } from "./trackedReposSlice";

// Code-split so x-charts only loads when a chart is actually shown
const StarsBarChart = lazy(() =>
  import("../../components/StarsBarChart").then((m) => ({ default: m.StarsBarChart })),
);

export function TrackedStarsChart() {
  const repos = useAppSelector(selectTrackedRepos);

  if (repos.length === 0) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h2" gutterBottom>
          Stars per tracked repository
        </Typography>
        <Suspense fallback={<Skeleton variant="rounded" height={160} />}>
          <StarsBarChart repos={repos} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
