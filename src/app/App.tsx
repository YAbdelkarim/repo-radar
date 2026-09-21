import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SearchBar } from "../features/search/SearchBar";
import { SearchResults } from "../features/search/SearchResults";

export default function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h1">Repo Radar</Typography>
        <SearchBar />
        <SearchResults />
      </Stack>
    </Container>
  );
}
