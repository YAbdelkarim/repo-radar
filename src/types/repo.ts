export interface TrackedRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  openIssues: number;
  lastActivity: string;
  ownerLogin: string;
  ownerAvatar: string;
}
