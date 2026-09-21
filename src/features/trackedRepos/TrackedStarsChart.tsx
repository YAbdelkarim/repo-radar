import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/hooks";
import { StarsBarChart } from "../../components/StarsBarChart";
import { selectTrackedRepos } from "./trackedReposSlice";

export function TrackedStarsChart() {
  const repos = useAppSelector(selectTrackedRepos);

  if (repos.length === 0) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h2" gutterBottom>
          Stars per tracked repository
        </Typography>
        <StarsBarChart repos={repos} />
      </CardContent>
    </Card>
  );
}
