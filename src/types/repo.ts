export interface TrackedRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  openIssues: number;
  lastActivity: string;
  ownerLogin: string;
  ownerAvatar: string;
}
