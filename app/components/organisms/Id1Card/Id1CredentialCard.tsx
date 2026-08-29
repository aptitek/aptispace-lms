import React, { forwardRef } from "react";
import Id1BaseCard from "./Id1BaseCard";
import type {
  Id1CredentialCardProps,
  Id1CredentialVariant,
} from "./Id1CredentialCard.types";
import Id1CredentialLayout from "./Id1CredentialLayout";

const DEFAULT_CREDENTIAL_CARD_PROPS = {
  layout: "aptispace" as Id1CredentialVariant,
  orientation: "landscape" as const,
};

/**
 * Id1CredentialCard - Credential card component extending Id1BaseCard
 *
 * Combines the base card physical features (holographic, electronics, guilloche)
 * with credential-specific layouts:
 * - AptiSpace Academy layout (cadet credentials)
 * - French CNIe layout (national identity card)
 *
 * This component wraps Id1BaseCard and provides the credential content
 * via the layout system (Id1CredentialLayout).
 */
export const Id1CredentialCard = forwardRef<
  HTMLDivElement,
  Id1CredentialCardProps
>((props, ref) => {
  const {
    credential,
    layout: _layout,
    content,
    children,
    ...baseCardProps
  } = props;

  const conf = {
    ...DEFAULT_CREDENTIAL_CARD_PROPS,
    layout: _layout,
    ...baseCardProps,
  };
  const isPortrait = conf.orientation === "portrait";

  // Render ghost content for transparent cards
  const renderGhostContent = (side: "front" | "back") => {
    return (
      <Id1CredentialLayout
        credential={credential}
        layout={conf.layout}
        side={side}
        isPortrait={isPortrait}
      />
    );
  };

  // Determine content for front and back
  const getFaceContent = (side: "front" | "back") => {
    // If custom content provided, use that
    if (content) return content;
    if (children) return children;

    // Otherwise render credential layout
    return (
      <Id1CredentialLayout
        credential={credential}
        layout={conf.layout}
        side={side}
        isPortrait={isPortrait}
      />
    );
  };

  return (
    <Id1BaseCard
      ref={ref}
      {...baseCardProps}
      frontContent={getFaceContent("front")}
      backContent={getFaceContent("back")}
      renderGhostContent={renderGhostContent}
    />
  );
});

Id1CredentialCard.displayName = "Id1CredentialCard";

export default Id1CredentialCard;
