export interface OpenSourcePullRequest {
  organization: string;
  repository: string;
  title: string;
  url: string;
  mergedAt: string;
}

export interface OpenSourceData {
  generatedAt: string;
  count: number;
  pullRequests: OpenSourcePullRequest[];
}
