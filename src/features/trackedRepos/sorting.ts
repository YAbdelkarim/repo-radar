import type { TrackedRepo } from "../../types/repo";

export type TrackedSortOption = "added" | "stars" | "name" | "activity" | "issues";

export const TRACKED_SORT_OPTIONS: { value: TrackedSortOption; label: string }[] = [
  { value: "added", label: "Recently tracked" },
  { value: "stars", label: "Most stars" },
  { value: "activity", label: "Last pushed" },
  { value: "issues", label: "Most open issues" },
  { value: "name", label: "Name (A–Z)" },
];

type Comparator = (a: TrackedRepo, b: TrackedRepo) => number;

const nameCollator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

// ISO-8601 timestamps sort lexicographically, so no Date parsing is needed
export const COMPARATORS: Record<Exclude<TrackedSortOption, "added">, Comparator> = {
  stars: (a, b) => b.stars - a.stars,
  activity: (a, b) => (a.lastActivity < b.lastActivity ? 1 : a.lastActivity > b.lastActivity ? -1 : 0),
  issues: (a, b) => b.openIssues - a.openIssues,
  name: (a, b) => nameCollator.compare(a.fullName, b.fullName),
};

// Top-k selection in O(n·k) instead of sorting the whole list, since k is tiny (3–5)
export function topBy<T>(items: readonly T[], k: number, compare: (a: T, b: T) => number): T[] {
  const top: T[] = [];
  for (const item of items) {
    if (top.length === k && compare(item, top[k - 1]) >= 0) continue;
    let i = Math.min(top.length, k - 1);
    while (i > 0 && compare(item, top[i - 1]) < 0) {
      top[i] = top[i - 1];
      i--;
    }
    top[i] = item;
  }
  return top;
}
