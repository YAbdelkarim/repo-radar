import type { RepoSearchSort } from "../../types/github";

export const SEARCH_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 800;

export type SortOption = RepoSearchSort | "best-match";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "Best match" },
  { value: "stars", label: "Most stars" },
  { value: "forks", label: "Most forks" },
  { value: "updated", label: "Recently updated" },
  { value: "help-wanted-issues", label: "Help-wanted issues" },
];

export function toApiSort(option: SortOption): RepoSearchSort | undefined {
  return option === "best-match" ? undefined : option;
}
