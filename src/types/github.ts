export interface GithubRepoOwner {
  login: string;
  avatar_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  owner: GithubRepoOwner;
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}
