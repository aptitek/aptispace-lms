import { forwardRef } from "react";
import Id1CredentialCard from "./Id1CredentialCard";
import type { Id1CardProps } from "./Id1Card.types";

/**
 * Id1Card - ISO/IEC 7810 ID-1 standard credential card with physical security features
 *
 * Combines physical substrate features (holographic foil, embedded electronics, procedural guilloche)
 * with credential layouts (AptiSpace Academy, French national ID).
 */
export const Id1Card = forwardRef<HTMLDivElement, Id1CardProps>(
  (props, ref) => {
    return <Id1CredentialCard ref={ref} {...props} />;
  },
);

Id1Card.displayName = "Id1Card";

export default Id1Card;
