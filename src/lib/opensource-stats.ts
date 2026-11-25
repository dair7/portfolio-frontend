import openSourceData from "../data/opensource.json";
import type { OpenSourceData } from "../types/opensource";

export interface OpenSourceStats {
  pullRequestCount: number;
  organizationCount: number;
}

export function getOpenSourceStats(
  data: OpenSourceData = openSourceData,
): OpenSourceStats {
  const organizations = new Set(
    data.pullRequests.map(({ organization }) => organization.toLowerCase()),
  );
  return {
    pullRequestCount: data.pullRequests.length,
    organizationCount: organizations.size,
  };
}
