import { forwardRef } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import type { GithubHandleProps } from "./GithubHandle.types";
import { GithubHandleRoot, HandleText } from "./GithubHandle.styles";

export function formatGithubUsername(username?: string | null): string {
  if (!username) return "@cadet";
  const trimmed = username.trim();
  if (!trimmed) return "@cadet";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

/**
 * GithubHandle Atom Component
 *
 * Renders the user's GitHub @username document ID with:
 * - Theme-gray Octocat icon
 * - Monospace "@<username>" format
 * - Subtle glassmorphic substrate frame
 */
export const GithubHandle = forwardRef<HTMLSpanElement, GithubHandleProps>(
  function GithubHandle(
    {
      username,
      size = "small",
      showIcon = true,
      className,
      testId = "github-handle",
      "data-testid": dataTestId,
    },
    ref,
  ) {
    const formattedHandle = formatGithubUsername(username);

    return (
      <GithubHandleRoot
        ref={ref}
        handleSize={size}
        className={className}
        data-testid={dataTestId || testId}
      >
        {showIcon && (
          <GitHubIcon
            className="octocat-icon"
            data-testid="octocat-icon"
            aria-hidden="true"
          />
        )}
        <HandleText data-testid="github-handle-text">
          {formattedHandle}
        </HandleText>
      </GithubHandleRoot>
    );
  },
);

GithubHandle.displayName = "GithubHandle";
export default GithubHandle;
