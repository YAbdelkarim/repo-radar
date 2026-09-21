import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import type { TrackedRepo } from "../types/repo";
import { formatCompact, formatFull } from "../utils/format";

const BAR_HEIGHT = 36;
const CHART_PADDING = 80;
const MAX_LABEL_LENGTH = 24;

function truncate(text: string): string {
  return text.length > MAX_LABEL_LENGTH ? `${text.slice(0, MAX_LABEL_LENGTH - 1)}…` : text;
}

interface StarsBarChartProps {
  repos: TrackedRepo[];
}

export function StarsBarChart({ repos }: StarsBarChartProps) {
  const dataset = useMemo(
    () =>
      [...repos]
        .sort((a, b) => b.stars - a.stars)
        .map((repo) => ({ name: repo.fullName, stars: repo.stars })),
    [repos],
  );

  return (
    <BarChart
      dataset={dataset}
      layout="horizontal"
      height={Math.max(160, dataset.length * BAR_HEIGHT + CHART_PADDING)}
      yAxis={[
        {
          scaleType: "band",
          dataKey: "name",
          width: 180,
          // Shorten long names on the axis, but show the full name in the tooltip
          valueFormatter: (name: string, context) =>
            context.location === "tick" ? truncate(name) : name,
        },
      ]}
      xAxis={[{ valueFormatter: (value: number) => formatCompact(value) }]}
      series={[
        {
          dataKey: "stars",
          label: "Stars",
          valueFormatter: (value) => (value === null ? "" : formatFull(value)),
        },
      ]}
      hideLegend
    />
  );
}
