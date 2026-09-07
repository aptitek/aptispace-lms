import type { ReactNode } from "react";
import type { AvatarShape } from "../../atoms/Avatar";

export type ImageUploadShape = AvatarShape;

export type ImageUploadSize = "sm" | "md" | "lg" | "xl";

export type ImageUploadMode = "inline" | "image-only";

export interface ImageUploadProps {
  /**
   * Current image URL (controlled mode)
   */
  value?: string;
  /**
   * Default image URL used for initial render and reset target
   */
  defaultValue?: string;
  /**
   * Optional name or identifier for MD3 avatar initials fallback
   */
  name?: string;
  /**
   * Callback fired when the image URL changes
   */
  onChange?: (imageUrl: string) => void;
  /**
   * Callback fired when the reset button is triggered
   */
  onReset?: () => void;
  /**
   * Optional custom upload handler to send the file to Cloudflare R2
   */
  onUpload?: (imageFile: File) => Promise<string>;
  /**
   * API endpoint to handle image uploads (default: "/api/avatars/upload")
   */
  uploadEndpoint?: string;
  /**
   * UI display mode:
   * - "inline": Side-by-side preview and input field (default)
   * - "image-only": Renders only the MD3 avatar/image; clicking opens a small modal to edit/upload
   * @default "inline"
   */
  mode?: ImageUploadMode;
  /**
   * Material Design 3 shape preset
   * @default "circular"
   */
  shape?: ImageUploadShape;
  /**
   * Optional role for role-based MD3 shape resolution (student -> pill, instructor -> ghost-ish, admin -> 9-sided-cookie)
   */
  role?: string | null;
  /**
   * Sizing preset (sm: 32px/40px, md: 48px/56px, lg: 72px/80px, xl: 96px/120px)
   * @default "md"
   */
  size?: ImageUploadSize;
  /**
   * Whether the image is editable. When false, acts as a normal read-only MD3 avatar/image.
   * @default true
   */
  editable?: boolean;
  /**
   * Whether to disable the hover tooltip over the image
   * @default false
   */
  disableTooltip?: boolean;
  /**
   * Whether to render the integrated preview (inline mode only)
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
  /**
   * Optional custom aspect ratio (e.g. "16 / 9", "3 / 1", "auto")
   */
  aspectRatio?: string;
  /**
   * Optional custom width (e.g. "100%", 200, "240px")
   */
  width?: number | string;
  /**
   * Optional custom height (e.g. 64, "72px", "100%")
   */
  height?: number | string;
  /**
   * Optional image object fit strategy (e.g. "contain", "cover")
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export interface UploadResponsePayload {
  url?: string;
  success?: boolean;
  error?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}
