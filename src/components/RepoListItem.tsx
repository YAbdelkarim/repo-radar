import { memo, type ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Star from "@mui/icons-material/Star";
import type { TrackedRepo } from "../types/repo";
import { formatCompact, formatFull } from "../utils/format";

interface RepoListItemProps {
  repo: TrackedRepo;
  rank?: number;
  action?: ReactNode;
  divider?: boolean;
}

export const RepoListItem = memo(function RepoListItem({
  repo,
  rank,
  action,
  divider,
}: RepoListItemProps) {
  const avatar = <Avatar src={repo.ownerAvatar} alt={repo.ownerLogin} />;

  return (
    <ListItem divider={divider} secondaryAction={action} sx={{ pr: action ? 14 : 2 }}>
      <ListItemAvatar>
        {rank === undefined ? (
          avatar
        ) : (
          <Badge
            badgeContent={rank}
            color="primary"
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            {avatar}
          </Badge>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontWeight: 500 }}
          >
            {repo.fullName}
          </Link>
        }
        secondary={
          <Stack component="span" direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Stack
              component="span"
              direction="row"
              spacing={0.25}
              title={`${formatFull(repo.stars)} stars`}
              sx={{ alignItems: "center", color: "warning.main", flexShrink: 0 }}
            >
              <Star sx={{ fontSize: 16 }} />
              <Typography component="span" variant="body2" sx={{ fontWeight: 500 }}>
                {formatCompact(repo.stars)}
              </Typography>
            </Stack>
            {repo.description && (
              <Typography component="span" variant="body2" noWrap color="text.secondary">
                {repo.description}
              </Typography>
            )}
          </Stack>
        }
        slotProps={{ primary: { noWrap: true }, secondary: { component: "div" } }}
      />
    </ListItem>
  );
});
