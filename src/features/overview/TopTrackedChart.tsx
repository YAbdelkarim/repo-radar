import { lazy, Suspense, useMemo } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import LeaderboardOutlined from "@mui/icons-material/LeaderboardOutlined";
import { useAppSelector } from "../../app/hooks";
import { selectTopStarredRepos } from "../trackedRepos/trackedReposSlice";

const TopStarsColumnChart = lazy(() => import("../../components/TopStarsColumnChart"));

const CHART_BARS = 3;
const CHART_HEIGHT = 280;

export function TopTrackedChart() {
  const topRepos = useAppSelector(selectTopStarredRepos);
  const repos = useMemo(() => topRepos.slice(0, CHART_BARS), [topRepos]);

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title="Stars leaderboard"
        subheader={`Top ${CHART_BARS} tracked repositories`}
        slotProps={{ title: { variant: "h6" } }}
        avatar={<LeaderboardOutlined color="primary" />}
      />
      <CardContent sx={{ pt: 0 }}>
        {repos.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nothing to chart yet.
          </Typography>
        ) : (
          <Suspense fallback={<Skeleton variant="rounded" height={CHART_HEIGHT} />}>
            <TopStarsColumnChart repos={repos} height={CHART_HEIGHT} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
}
