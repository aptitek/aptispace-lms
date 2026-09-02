import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { recordHydrationError } from "~/utils/hydrationTracker";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
    {
      onRecoverableError(error, errorInfo) {
        recordHydrationError(error, errorInfo);
        console.error(
          "[React Hydration / Recoverable Error]",
          error,
          errorInfo,
        );
      },
      onUncaughtError(error, errorInfo) {
        recordHydrationError(error, errorInfo);
      },
    },
  );
});
