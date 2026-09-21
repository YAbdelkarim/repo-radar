import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import type { TrackedRepo } from "../types/repo";
import { formatCompact, formatFull, truncate } from "../utils/format";

const MAX_LABEL_LENGTH = 16;

interface TopStarsColumnChartProps {
  repos: TrackedRepo[];
  height?: number;
}

// Default export so it can be code-split with React.lazy (x-charts is a heavy dependency)
export default function TopStarsColumnChart({ repos, height = 280 }: TopStarsColumnChartProps) {
  const theme = useTheme();
  const dataset = useMemo(
    () => repos.map((repo) => ({ name: repo.fullName, stars: repo.stars })),
    [repos],
  );

  return (
    <BarChart
      dataset={dataset}
      height={height}
      borderRadius={6}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "name",
          categoryGapRatio: 0.45,
          // Repo name on the axis, "owner/name" in the tooltip
          valueFormatter: (name: string, context) =>
            context.location === "tick"
              ? truncate(name.slice(name.indexOf("/") + 1), MAX_LABEL_LENGTH)
              : name,
        },
      ]}
      yAxis={[
        {
          width: 48,
          // Headroom above the tallest bar so its label isn't clipped
          domainLimit: (min, max) => ({ min, max: Number(max) * 1.15 }),
          valueFormatter: (value: number) => formatCompact(value),
        },
      ]}
      series={[
        {
          dataKey: "stars",
          label: "Stars",
          // CSS variable, so the bars follow the active light/dark color scheme
          color: (theme.vars ?? theme).palette.primary.main,
          barLabel: (item) => (item.value === null ? null : formatCompact(item.value)),
          barLabelPlacement: "outside",
          valueFormatter: (value) => (value === null ? "" : formatFull(value)),
        },
      ]}
      hideLegend
    />
  );
}
