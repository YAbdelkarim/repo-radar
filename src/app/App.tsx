import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "./hooks";
import { SearchBar } from "../features/search/SearchBar";
import { SearchResults } from "../features/search/SearchResults";
import { TrackedReposList } from "../features/trackedRepos/TrackedReposList";
import { selectTrackedCount } from "../features/trackedRepos/trackedReposSlice";

type View = "search" | "tracked";

export default function App() {
  const [view, setView] = useState<View>("search");
  const trackedCount = useAppSelector(selectTrackedCount);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">Repo Radar</Typography>

        <Tabs value={view} onChange={(_event, value: View) => setView(value)}>
          <Tab label="Search" value="search" id="tab-search" aria-controls="panel-search" />
          <Tab
            label={`Tracked (${trackedCount})`}
            value="tracked"
            id="tab-tracked"
            aria-controls="panel-tracked"
          />
        </Tabs>

        <Box
          role="tabpanel"
          id="panel-search"
          aria-labelledby="tab-search"
          hidden={view !== "search"}
        >
          <Stack spacing={3}>
            <SearchBar />
            <SearchResults />
          </Stack>
        </Box>

        <Box
          role="tabpanel"
          id="panel-tracked"
          aria-labelledby="tab-tracked"
          hidden={view !== "tracked"}
        >
          <TrackedReposList />
        </Box>
      </Stack>
    </Container>
  );
}
