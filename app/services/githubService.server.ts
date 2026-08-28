import { Octokit } from "octokit";

export function createOctokitClient(accessToken?: string): Octokit {
  return new Octokit({
    auth: accessToken,
  });
}

export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
}

export async function fetchGitHubUserProfile(
  accessToken: string,
): Promise<GitHubUserProfile> {
  const octokit = createOctokitClient(accessToken);
  const response = await octokit.rest.users.getAuthenticated();
  const profile = response.data;

  let primaryEmail = profile.email;

  if (!primaryEmail) {
    try {
      const emailResponse =
        await octokit.rest.users.listEmailsForAuthenticatedUser();
      const primaryEmailObject =
        emailResponse.data.find((entry) => entry.primary && entry.verified) ??
        emailResponse.data[0];
      if (primaryEmailObject) {
        primaryEmail = primaryEmailObject.email;
      }
    } catch {
      // Ignore error if email scope is restricted
    }
  }

  return {
    id: profile.id,
    login: profile.login,
    name: profile.name ?? profile.login,
    email: primaryEmail ?? `${profile.login}@users.noreply.github.com`,
    avatarUrl: profile.avatar_url,
  };
}

export async function fetchRepositoryDetails(
  accessToken: string,
  owner: string,
  repo: string,
) {
  const octokit = createOctokitClient(accessToken);
  const response = await octokit.rest.repos.get({ owner, repo });
  return response.data;
}

export async function fetchPullRequests(
  accessToken: string,
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "all",
) {
  const octokit = createOctokitClient(accessToken);
  const response = await octokit.rest.pulls.list({ owner, repo, state });
  return response.data;
}

export async function fetchPullRequestDetails(
  accessToken: string,
  owner: string,
  repo: string,
  pullNumber: number,
) {
  const octokit = createOctokitClient(accessToken);
  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });
  return response.data;
}
