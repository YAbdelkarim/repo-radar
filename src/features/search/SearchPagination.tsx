import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchSearchResults } from "./searchSlice";

export function SearchPagination() {
  const dispatch = useAppDispatch();
  const { params, pagination, status } = useAppSelector((state) => state.search);

  const { hasPrev, hasNext, lastPage } = pagination;
  if (!params || (!hasPrev && !hasNext)) return null; // nothing to paginate

  const page = params.page;
  const isLoading = status === "loading";

  const goToPage = (target: number) => {
    dispatch(fetchSearchResults({ ...params, page: target }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Stack
      component="nav"
      aria-label="Search results pages"
      direction="row"
      spacing={1}
      sx={{ justifyContent: "center", alignItems: "center" }}
    >
      <Tooltip title="First page">
        <span>
          <IconButton
            aria-label="First page"
            disabled={!hasPrev || isLoading}
            onClick={() => goToPage(1)}
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Previous page">
        <span>
          <IconButton
            aria-label="Previous page"
            disabled={!hasPrev || isLoading}
            onClick={() => goToPage(page - 1)}
          >
            <NavigateBefore />
          </IconButton>
        </span>
      </Tooltip>

      <Typography variant="body2" sx={{ minWidth: 110, textAlign: "center" }}>
        Page {page}
        {lastPage !== null && ` of ${lastPage}`}
      </Typography>

      <Tooltip title="Next page">
        <span>
          <IconButton
            aria-label="Next page"
            disabled={!hasNext || isLoading}
            onClick={() => goToPage(page + 1)}
          >
            <NavigateNext />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Last page">
        <span>
          <IconButton
            aria-label="Last page"
            disabled={!hasNext || lastPage === null || isLoading}
            onClick={() => lastPage !== null && goToPage(lastPage)}
          >
            <LastPage />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
