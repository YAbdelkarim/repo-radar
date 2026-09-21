import type { TrackedRepo } from "../../types/repo";

const STORAGE_KEY = "repo-radar:tracked-repos";

export function loadTrackedRepos(): TrackedRepo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TrackedRepo[]) : [];
  } catch {
    return [];
  }
}

export function saveTrackedRepos(repos: TrackedRepo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repos));
  } catch (error) {
    console.error("Couldn't save tracked repos.\n" + error);
  }
}
