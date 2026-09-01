export type GithubHandleSize = "small" | "medium" | "large";

export interface GithubHandleProps {
  /**
   * GitHub username/handle (e.g. "aptitek" or "@aptitek")
   */
  username?: string | null;
  /**
   * Sizing scale
   * @default "small"
   */
  size?: GithubHandleSize;
  /**
   * Whether to render the GitHub Octocat icon before the username
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Test identifier
   */
  testId?: string;
  "data-testid"?: string;
}
