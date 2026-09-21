import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toTrackedRepo } from "../../api/mappers";
import { RepoListItem } from "../../components/RepoListItem";
import { useDebounce } from "../../hooks/useDebounce";
import { SEARCH_DEBOUNCE_MS } from "../search/constants";
import { TrackButton } from "../trackedRepos/TrackButton";
import { useTopStarredSearch } from "./useTopStarredSearch";

const MINI_SEARCH_LIMIT = 5;

function ListSkeleton() {
  return (
    <List disablePadding>
      {Array.from({ length: MINI_SEARCH_LIMIT }, (_, i) => (
        <ListItem key={i} divider={i < MINI_SEARCH_LIMIT - 1}>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText primary={<Skeleton width="45%" />} secondary={<Skeleton width="70%" />} />
        </ListItem>
      ))}
    </List>
  );
}

export function MiniSearch() {
  const [input, setInput] = useState("");
  const query = useDebounce(input.trim(), SEARCH_DEBOUNCE_MS);
  const { status, items, error, retry } = useTopStarredSearch(query, MINI_SEARCH_LIMIT);

  const repos = useMemo(
    () => items.map((item) => ({ item, repo: toTrackedRepo(item) })),
    [items],
  );
  const isLoading = status === "loading" || (input.trim() !== query && input.trim() !== "");

  let body;
  if (status === "failed") {
    body = (
      <Alert
        severity="error"
        sx={{ mx: 2, my: 1 }}
        action={
          <Button color="inherit" size="small" onClick={retry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  } else if (repos.length === 0) {
    body =
      isLoading ? (
        <ListSkeleton />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3 }}>
          No repositories match "{query}".
        </Typography>
      );
  } else {
    body = (
      <List
        disablePadding
        aria-busy={isLoading}
        sx={{ opacity: status === "loading" ? 0.5 : 1, transition: "opacity 150ms" }}
      >
        {repos.map(({ item, repo }, index) => (
          <RepoListItem
            key={repo.id}
            repo={repo}
            divider={index < repos.length - 1}
            action={<TrackButton repo={item} />}
          />
        ))}
      </List>
    );
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title="Quick search"
        subheader={`Top ${MINI_SEARCH_LIMIT} by stars`}
        slotProps={{ title: { variant: "h6" } }}
        avatar={<SearchIcon color="primary" />}
      />
      <CardContent sx={{ pt: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search GitHub, e.g. react"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          slotProps={{
            htmlInput: { "aria-label": "Quick search GitHub repositories" },
            input: {
              endAdornment: input ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear quick search"
                    edge="end"
                    size="small"
                    onClick={() => setInput("")}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </CardContent>
      {/* Nothing below the input until there's a query */}
      {(status !== "idle" || isLoading) && (
        <>
          <LinearProgress sx={{ visibility: isLoading ? "visible" : "hidden" }} />
          <Box sx={{ minHeight: 120 }}>{body}</Box>
        </>
      )}
    </Card>
  );
}
