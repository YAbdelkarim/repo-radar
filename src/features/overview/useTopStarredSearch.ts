import { useCallback, useEffect, useState } from "react";
import { searchRepos } from "../../api/repos";
import { toErrorMessage } from "../../api/error";
import type { GithubRepo } from "../../types/github";

const CACHE_TTL_MS = 5 * 60_000;
const CACHE_MAX_ENTRIES = 30;

// Module-level so results survive tab switches and repeated queries skip the network
const cache = new Map<string, { items: GithubRepo[]; fetchedAt: number }>();

function readCache(key: string): GithubRepo[] | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    cache.delete(key);
    return undefined;
  }
  return entry.items;
}

function writeCache(key: string, items: GithubRepo[]) {
  cache.delete(key); // re-insert so Map order tracks recency
  cache.set(key, { items, fetchedAt: Date.now() });
  if (cache.size > CACHE_MAX_ENTRIES) cache.delete(cache.keys().next().value!);
}

interface Result {
  key: string;
  items: GithubRepo[];
  error: string | null;
}

export type TopStarredSearch =
  | { status: "idle"; items: GithubRepo[]; error: null }
  | { status: "loading"; items: GithubRepo[]; error: null }
  | { status: "succeeded"; items: GithubRepo[]; error: null }
  | { status: "failed"; items: GithubRepo[]; error: string };

const EMPTY: GithubRepo[] = [];

/** Searches GitHub for the `limit` most-starred repos matching `query` (already debounced). */
export function useTopStarredSearch(query: string, limit: number) {
  const key = `${limit}:${query.toLowerCase()}`;
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);
  const cached = query ? readCache(key) : undefined;

  useEffect(() => {
    if (!query || readCache(key)) return;
    const controller = new AbortController();
    searchRepos(query, limit, 1, "stars", controller.signal).then(
      ({ items }) => {
        writeCache(key, items);
        setResult({ key, items, error: null });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return; // superseded by a newer query
        setResult({ key, items: [], error: toErrorMessage(error) });
      },
    );
    return () => controller.abort();
  }, [query, key, limit, attempt]);

  const retry = useCallback(() => {
    setResult(null);
    setAttempt((n) => n + 1);
  }, []);

  let search: TopStarredSearch;
  if (!query) search = { status: "idle", items: EMPTY, error: null };
  else if (cached) search = { status: "succeeded", items: cached, error: null };
  else if (result?.key === key && result.error)
    search = { status: "failed", items: EMPTY, error: result.error };
  // Keep showing the previous results while the next ones load
  else search = { status: "loading", items: result?.items ?? EMPTY, error: null };

  return { ...search, retry };
}
