export interface OpenSourceHighlight {
  organization: string;
  repository: string;
  number: number;
  url: string;
  title: string;
  note: string;
}

export const openSourceHighlights: OpenSourceHighlight[] = [
  {
    organization: "Predictify-org",
    repository: "predictify-backend",
    number: 873,
    url: "https://github.com/Predictify-org/predictify-backend/pull/873",
    title: "Reconcile circuit breaker API and mount impersonate router",
    note: "TODO(dair): one line on what this PR solved.",
  },
  {
    organization: "ThinknetCollective",
    repository: "mesh-up_api",
    number: 46,
    url: "https://github.com/ThinknetCollective/mesh-up_api/pull/46",
    title: "Cursor-based pagination for solutions, comments and search",
    note: "TODO(dair): one line on what this PR solved.",
  },
  {
    organization: "Stellar-Uzima",
    repository: "Uzima-Frontend",
    number: 328,
    url: "https://github.com/Stellar-Uzima/Uzima-Frontend/pull/328",
    title: "Multi-select and bulk actions in the admin user table",
    note: "TODO(dair): one line on what this PR solved.",
  },
];

export const mergedPullRequestsUrl =
  "https://github.com/search?q=is%3Apr+author%3Adair7+is%3Amerged&type=pullrequests";
