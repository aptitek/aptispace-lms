import type { ReactNode } from "react";

export type EditableAvatarShape =
  "circular" | "rounded" | "square" | "biometric";

export type EditableAvatarSize = "sm" | "md" | "lg" | "xl";

export type EditableAvatarMode = "inline" | "image-only";

export interface EditableAvatarProps {
  /**
   * Current avatar image URL (controlled mode)
   */
  value?: string;
  /**
   * Default avatar image URL used for initial render and reset target
   */
  defaultValue?: string;
  /**
   * Optional name or identifier for MD3 avatar initials fallback
   */
  name?: string;
  /**
   * Callback fired when the avatar image URL changes
   */
  onChange?: (avatarUrl: string) => void;
  /**
   * Callback fired when the reset button is triggered
   */
  onReset?: () => void;
  /**
   * Optional custom upload handler to send the file to Cloudflare R2
   */
  onUpload?: (avatarFile: File) => Promise<string>;
  /**
   * API endpoint to handle avatar uploads (default: "/api/avatar/upload")
   */
  uploadEndpoint?: string;
  /**
   * UI display mode:
   * - "inline": Side-by-side avatar preview and input field (default)
   * - "image-only": Renders only the MD3 avatar; clicking opens a small modal to edit/upload
   * @default "inline"
   */
  mode?: EditableAvatarMode;
  /**
   * Material Design 3 avatar shape preset
   * @default "circular"
   */
  shape?: EditableAvatarShape;
  /**
   * Avatar sizing preset (sm: 32px/40px, md: 48px/56px, lg: 72px/80px, xl: 96px/120px)
   * @default "md"
   */
  size?: EditableAvatarSize;
  /**
   * Whether the avatar is editable. When false, acts as a normal read-only MD3 avatar.
   * @default true
   */
  editable?: boolean;
  /**
   * Whether to render the integrated avatar preview (inline mode only)
   * @default true
   */
  showPreview?: boolean;
  /**
   * Custom placeholder text for the unified input / drop area
   */
  placeholder?: string;
  /**
   * Label for the component
   */
  label?: string;
  /**
   * Custom helper text displayed underneath the input
   */
  helperText?: string;
  /**
   * Additional slot content rendered alongside actions
   */
  extraActions?: ReactNode;
  /**
   * CSS class name
   */
  className?: string;
  /**
   * Accessible test ID
   */
  testId?: string;
}

export interface UploadResponsePayload {
  url?: string;
  success?: boolean;
  error?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}
