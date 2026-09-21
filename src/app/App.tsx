import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "./hooks";
import { SearchBar } from "../features/search/SearchBar";
import { RepoCard } from "../components/RepoCard";
import { toTrackedRepo } from "../api/mappers";

export default function App() {
  const search = useAppSelector((state) => state.search);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">Repo Radar</Typography>

        <SearchBar />

        {/* Debug info: remove once the real results list exists */}
        <Typography variant="body2" color="text.secondary">
          Status: {search.status}
          {search.params &&
            ` · query: "${search.params.query}" · sort: ${search.params.sort ?? "best match"} · page: ${search.params.page}`}
          {search.status === "succeeded" && ` · ${search.totalCount.toLocaleString()} results`}
        </Typography>

        {search.error && (
          <Typography variant="body2" color="error">
            Error: {search.error}
          </Typography>
        )}

        {search.items.map((repo) => (
          <RepoCard key={repo.id} repo={toTrackedRepo(repo)} />
        ))}
      </Stack>
    </Container>
  );
}
