import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import EmojiEventsOutlined from "@mui/icons-material/EmojiEventsOutlined";
import { useAppSelector } from "../../app/hooks";
import { RepoListItem } from "../../components/RepoListItem";
import { selectTopStarredRepos, TOP_TRACKED_COUNT } from "../trackedRepos/trackedReposSlice";

export function TopTrackedList() {
  const repos = useAppSelector(selectTopStarredRepos);

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        title={`Your top ${TOP_TRACKED_COUNT}`}
        subheader="Your most-starred tracked repos"
        slotProps={{ title: { variant: "h6" } }}
        avatar={<EmojiEventsOutlined color="primary" />}
      />
      {repos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 3 }}>
          Track repositories to see your most-starred ones here.
        </Typography>
      ) : (
        <List disablePadding>
          {repos.map((repo, index) => (
            <RepoListItem
              key={repo.id}
              repo={repo}
              rank={index + 1}
              divider={index < repos.length - 1}
            />
          ))}
        </List>
      )}
    </Card>
  );
}
