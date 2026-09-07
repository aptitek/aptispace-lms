import type {
  ReactNode,
  RefObject,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LoadingIndicator from "../../atoms/LoadingIndicator";
import Tooltip from "@mui/material/Tooltip";
import Avatar, { resolveAvatarShape } from "../../atoms/Avatar";
import Badge from "../../atoms/Badge/Badge";
import type { ImageUploadShape, ImageUploadSize } from "./ImageUpload.types";
import {
  MD3AvatarContainer,
  AvatarHoverOverlay,
  UnifiedDropInputArea,
  InputPrefixIconHolder,
  TextInput,
  ActionsContainer,
  ActionIconButton,
  HiddenFileInput,
  DragBadgeHint,
  HelperMessage,
} from "./ImageUpload.styles";

export interface MD3AvatarProps {
  url: string;
  name?: string;
  shape?: ImageUploadShape;
  role?: string | null;
  size?: ImageUploadSize;
  editable?: boolean;
  disableTooltip?: boolean;
  isModified: boolean;
  isDragging: boolean;
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  onAvatarClick: () => void;
  onResetClick: (e: MouseEvent) => void;
}

export function AvatarResetActionButton({
  onResetClick,
}: {
  onResetClick: (e: MouseEvent) => void;
}) {
  const { t } = useTranslation("common");
  const label = t("avatar.resetToDefault", "Reset avatar to default");
  return (
    <Tooltip title={label}>
      <Box
        component="button"
        type="button"
        onClick={onResetClick}
        aria-label={label}
        data-testid="avatar-reset-button"
        sx={{
          position: "absolute",
          top: -4,
          right: -4,
          zIndex: 10,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          outline: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": { transform: "scale(1.15)" },
        }}
      >
        <Badge
          color="error"
          shape="circle"
          size="small"
          icon={<RestartAltRoundedIcon sx={{ fontSize: 13 }} />}
          standalone
          testId="avatar-reset-badge"
        />
      </Box>
    </Tooltip>
  );
}

function getAvatarTooltipConfig(
  props: MD3AvatarProps,
  t: (k: string, f: string) => string,
) {
  const isInteractive = props.editable !== false;
  const tooltipText = isInteractive
    ? t("avatar.clickToEdit", "Click to edit avatar")
    : props.name || "";
  const showTooltip = !props.disableTooltip && Boolean(tooltipText);
  return { isInteractive, tooltipText, showTooltip };
}

function getInteractiveContainerProps(
  isInteractive: boolean,
  tooltipText: string,
  onAvatarClick: () => void,
) {
  if (!isInteractive) {
    return {};
  }
  return {
    onClick: onAvatarClick,
    role: "button",
    tabIndex: 0,
    "aria-label": tooltipText || undefined,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onAvatarClick();
      }
    },
  };
}

function AvatarHoverLayer({
  show,
  shape,
  size,
  aspectRatio,
  label,
}: {
  show: boolean;
  shape?: ImageUploadShape;
  size?: ImageUploadSize;
  aspectRatio?: string;
  label: string;
}) {
  if (!show) return null;
  return (
    <AvatarHoverOverlay
      className="avatar-hover-overlay"
      avatarShape={shape}
      avatarSize={size}
      customRatio={aspectRatio}
    >
      <EditRoundedIcon sx={{ fontSize: "1.1rem" }} />
      <span>{label}</span>
    </AvatarHoverOverlay>
  );
}

export function MD3AvatarDisplay(props: MD3AvatarProps) {
  const { t } = useTranslation("common");
  const resolvedShape = resolveAvatarShape(props.shape, props.role);
  const { isInteractive, tooltipText, showTooltip } = getAvatarTooltipConfig(
    props,
    t,
  );
  const interactiveProps = getInteractiveContainerProps(
    isInteractive,
    tooltipText,
    props.onAvatarClick,
  );

  return (
    <Tooltip
      title={tooltipText}
      arrow
      placement="top"
      disableHoverListener={!showTooltip}
    >
      <MD3AvatarContainer
        avatarShape={resolvedShape}
        avatarSize={props.size}
        customRatio={props.aspectRatio}
        customWidth={props.width}
        customHeight={props.height}
        isInteractive={isInteractive}
        isDragging={props.isDragging}
        {...interactiveProps}
      >
        <Avatar
          src={props.url}
          alt={props.name || "Avatar"}
          name={props.name}
          showReticle={resolvedShape === "biometric"}
          shape={resolvedShape}
          height={props.height ?? "100%"}
          width={props.width ?? "100%"}
          aspectRatio={props.aspectRatio}
          objectFit={props.objectFit}
          overlay={
            <AvatarHoverLayer
              show={isInteractive}
              shape={resolvedShape}
              size={props.size}
              aspectRatio={props.aspectRatio}
              label={t("avatar.edit", "EDIT")}
            />
          }
        />
        {isInteractive && props.isModified ? (
          <AvatarResetActionButton onResetClick={props.onResetClick} />
        ) : null}
      </MD3AvatarContainer>
    </Tooltip>
  );
}

export interface AvatarInputBarProps {
  inputId: string;
  value: string;
  placeholder?: string;
  label?: string;
  isDragging: boolean;
  hasError: boolean;
  isUploading: boolean;
  isModified: boolean;
  extraActions?: ReactNode;
  onChange: (value: string) => void;
  onBrowse: () => void;
  onReset: () => void;
}

export function AvatarInputBar(props: AvatarInputBarProps) {
  const { t } = useTranslation("common");

  return (
    <UnifiedDropInputArea
      isDragging={props.isDragging}
      hasError={props.hasError}
    >
      {props.isDragging ? (
        <DragBadgeHint>
          <CloudUploadRoundedIcon />
          <span>
            {t("avatar.dropImageHint", "Drop image to set or upload avatar")}
          </span>
        </DragBadgeHint>
      ) : null}

      <InputPrefixIconHolder>
        <LinkRoundedIcon fontSize="small" />
      </InputPrefixIconHolder>

      <TextInput
        id={props.inputId}
        value={props.value}
        placeholder={
          props.placeholder ||
          t("avatar.pasteUrlOrDrag", "Paste image URL or drag & drop...")
        }
        aria-label={props.label || t("avatar.inputLabel", "Image URL")}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.onChange(e.target.value)
        }
        disabled={props.isUploading}
      />

      <ActionsContainer>
        <ActionIconButton
          type="button"
          onClick={props.onBrowse}
          disabled={props.isUploading}
          variantType="primary"
          title={t("avatar.browseDevice", "Upload from device")}
          aria-label={t("avatar.browseDevice", "Upload from device")}
          size="small"
        >
          {props.isUploading ? (
            <LoadingIndicator size={18} />
          ) : (
            <CloudUploadRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </ActionIconButton>

        {props.isModified ? (
          <ActionIconButton
            type="button"
            onClick={props.onReset}
            disabled={props.isUploading}
            variantType="danger"
            title={t("avatar.resetToDefault", "Reset to default")}
            aria-label={t("avatar.resetToDefault", "Reset to default")}
            size="small"
          >
            <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
          </ActionIconButton>
        ) : null}

        {props.extraActions}
      </ActionsContainer>
    </UnifiedDropInputArea>
  );
}

export function SimpleEditModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation("common");

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
            p: 1,
            bgcolor: "background.paper",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "1rem",
          fontWeight: 700,
          p: 1.5,
        }}
      >
        <span>{t("avatar.editAvatar", "Edit Image")}</span>
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 1.5, pt: "6px !important" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {children}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export function HiddenPicker({
  fileInputRef,
  isUploading,
  onProcessFile,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onProcessFile: (file: File) => void;
}) {
  return (
    <HiddenFileInput
      ref={fileInputRef}
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
          onProcessFile(selectedFiles[0]);
        }
        event.target.value = "";
      }}
      disabled={isUploading}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export function ImageUploadModals({
  isModalOpen,
  isImageOnly,
  onClose,
  inputBar,
  helperContent,
  errorMessage,
}: {
  isModalOpen: boolean;
  isImageOnly: boolean;
  onClose: () => void;
  inputBar: ReactNode;
  helperContent?: ReactNode;
  errorMessage?: string | null;
}) {
  return (
    <>
      <SimpleEditModal isOpen={isModalOpen && isImageOnly} onClose={onClose}>
        {inputBar}
        {helperContent ? (
          <HelperMessage isError={Boolean(errorMessage)}>
            {helperContent}
          </HelperMessage>
        ) : null}
      </SimpleEditModal>
      {!isImageOnly && helperContent ? (
        <HelperMessage isError={Boolean(errorMessage)}>
          {helperContent}
        </HelperMessage>
      ) : null}
    </>
  );
}
