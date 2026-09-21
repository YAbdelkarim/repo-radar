import type { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import StarBorder from "@mui/icons-material/StarBorder";
import BugReportOutlined from "@mui/icons-material/BugReportOutlined";
import Update from "@mui/icons-material/Update";
import type { TrackedRepo } from "../types/repo";
import { formatCompact, formatDate, formatFull } from "../utils/format";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

interface RepoCardProps {
  repo: TrackedRepo;
  actions?: ReactNode;
  loading?: boolean;
  error?: string | null;
}

interface StatProps {
  icon: ReactNode;
  value: string;
  tooltip: string;
}

function Stat({ icon, value, tooltip }: StatProps) {
  return (
    <Tooltip title={tooltip}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
        {icon}
        <Typography variant="body2">{value}</Typography>
      </Stack>
    </Tooltip>
  );
}

export function RepoCard({ repo, actions, loading = false, error = null }: RepoCardProps) {
  return (
    <Card
      variant="outlined"
      aria-busy={loading}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
      <CardHeader
        avatar={<Avatar src={repo.ownerAvatar} alt={repo.ownerLogin} />}
        title={
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontWeight: 500, wordBreak: "break-word" }}
          >
            {repo.fullName}
          </Link>
        }
      />

      <CardContent
        sx={{
          flexGrow: 1,
          pt: 0,
          opacity: loading ? 0.6 : 1,
          transition: "opacity 150ms",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {repo.description || "No description provided."}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Stat
            icon={<StarBorder fontSize="small" />}
            value={formatCompact(repo.stars)}
            tooltip={`${formatFull(repo.stars)} stars`}
          />
          <Stat
            icon={<BugReportOutlined fontSize="small" />}
            value={formatCompact(repo.openIssues)}
            tooltip={`${formatFull(repo.openIssues)} open issues`}
          />
          <Stat
            icon={<Update fontSize="small" />}
            value={formatDate(repo.lastActivity)}
            tooltip="Last pushed"
          />
        </Stack>
      </CardContent>

      {error && (
        <Alert severity="error" sx={{ mx: 2, mb: 1 }}>
          {error} Showing last saved data.
        </Alert>
      )}

      {actions && <CardActions sx={{ justifyContent: "flex-end" }}>{actions}</CardActions>}
    </Card>
  );
}
