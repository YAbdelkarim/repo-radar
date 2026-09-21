import { type GithubRepo } from "../types/github";
import { type TrackedRepo } from "../types/repo";

export function toTrackedRepo(repo: GithubRepo): TrackedRepo {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    openIssues: repo.open_issues_count,
    lastActivity: repo.pushed_at,
    ownerLogin: repo.owner.login,
    ownerAvatar: repo.owner.avatar_url,
  };
}
