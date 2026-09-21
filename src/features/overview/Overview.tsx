import Grid from "@mui/material/Grid";
import { MiniSearch } from "./MiniSearch";
import { TopTrackedChart } from "./TopTrackedChart";
import { TopTrackedList } from "./TopTrackedList";

export function Overview() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <MiniSearch />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TopTrackedList />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TopTrackedChart />
      </Grid>
    </Grid>
  );
}
