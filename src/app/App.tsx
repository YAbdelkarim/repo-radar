import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import BookmarksOutlined from "@mui/icons-material/BookmarksOutlined";
import Radar from "@mui/icons-material/Radar";
import { useAppSelector } from "./hooks";
import { AutoHeight } from "../components/AutoHeight";
import { ThemeToggle } from "../components/ThemeToggle";
import { Overview } from "../features/overview/Overview";
import { SearchBar } from "../features/search/SearchBar";
import { SearchResults } from "../features/search/SearchResults";
import { TrackedReposList } from "../features/trackedRepos/TrackedReposList";
import { selectTrackedCount } from "../features/trackedRepos/trackedReposSlice";
import { TrackedStarsChart } from "../features/trackedRepos/TrackedStarsChart";

type View = "overview" | "search" | "tracked";

interface TabPanelProps {
  view: View;
  active: View;
  visited: boolean;
  children: ReactNode;
}

// Mounts a panel on first visit, then keeps it mounted (hidden) so its state survives tab switches
function TabPanel({ view, active, visited, children }: TabPanelProps) {
  return (
    <Box role="tabpanel" id={`panel-${view}`} aria-labelledby={`tab-${view}`} hidden={view !== active}>
      {visited && children}
    </Box>
  );
}

export default function App() {
  const [view, setView] = useState<View>("overview");
  const [visited, setVisited] = useState<ReadonlySet<View>>(() => new Set([view]));
  const trackedCount = useAppSelector(selectTrackedCount);

  const changeView = (next: View) => {
    setView(next);
    setVisited((prev) => (prev.has(next) ? prev : new Set(prev).add(next)));
  };

  const panelProps = (panel: View) => ({ view: panel, active: view, visited: visited.has(panel) });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} sx={{ alignItems: "center", flexGrow: 1 }}>
            <Radar color="primary" sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography variant="h1" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
              Repo Radar
            </Typography>
          </Stack>
          <ThemeToggle />
        </Stack>

        <Tabs
          value={view}
          onChange={(_event, value: View) => changeView(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<DashboardOutlined />}
            iconPosition="start"
            label="Overview"
            value="overview"
            id="tab-overview"
            aria-controls="panel-overview"
          />
          <Tab
            icon={<SearchOutlined />}
            iconPosition="start"
            label="Search"
            value="search"
            id="tab-search"
            aria-controls="panel-search"
          />
          <Tab
            icon={<BookmarksOutlined />}
            iconPosition="start"
            label={`Tracked (${trackedCount})`}
            value="tracked"
            id="tab-tracked"
            aria-controls="panel-tracked"
          />
        </Tabs>

        <TabPanel {...panelProps("overview")}>
          <Overview />
        </TabPanel>

        <TabPanel {...panelProps("search")}>
          <Paper variant="outlined">
            <AutoHeight>
              <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
                <SearchBar />
                <SearchResults />
              </Stack>
            </AutoHeight>
          </Paper>
        </TabPanel>

        <TabPanel {...panelProps("tracked")}>
          <Stack spacing={3}>
            <TrackedStarsChart />
            <TrackedReposList />
          </Stack>
        </TabPanel>
      </Stack>
    </Container>
  );
}
