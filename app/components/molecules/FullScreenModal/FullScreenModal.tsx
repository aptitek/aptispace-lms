import { useEffect, type MouseEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import type { FullScreenModalProps } from "./FullScreenModal.types";
import { ModalBackdrop, ModalCardSurface } from "./FullScreenModal.styles";

export function FullScreenModal({
  isOpen,
  onClose,
  children,
  maxWidth,
  asCard = false,
  sx,
  className,
  testId = "fullscreen-modal",
}: FullScreenModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className={className}
          data-testid={testId}
          role="dialog"
          aria-modal="true"
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onClick={(clickEv: MouseEvent) => clickEv.stopPropagation()}
            onKeyDown={(e: KeyboardEvent) => e.stopPropagation()}
            sx={[
              {
                width: "100%",
                maxWidth: maxWidth ?? (asCard ? 720 : "max-content"),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
              ...(Array.isArray(sx) ? sx : [sx]),
            ]}
          >
            {asCard ? (
              <ModalCardSurface elevation={12}>{children}</ModalCardSurface>
            ) : (
              children
            )}
          </Box>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
}

export default FullScreenModal;
