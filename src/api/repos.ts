import { octokit } from "./githubClient";
import type { GithubSearchResponse, RepoSearchResult, RepoSearchSort } from "../types/github";
import { parseLinkHeader } from "../utils/parseLinkHeader";

const API_VERSION = "2026-03-10";

export async function searchRepos(
  query: string,
  perPage: number,
  page: number,
  sort?: RepoSearchSort,
): Promise<RepoSearchResult> {
  const res = await octokit.request("GET /search/repositories", {
    q: query,
    sort,
    per_page: perPage,
    page,
    headers: { "X-GitHub-Api-Version": API_VERSION },
  });
  const data = res.data as GithubSearchResponse;
  const links = parseLinkHeader(res.headers.link);

  return {
    items: data.items,
    totalCount: data.total_count,
    pagination: {
      hasPrev: Boolean(links.prev),
      hasNext: Boolean(links.next),
      lastPage: links.last ?? null,
    },
  };
}
