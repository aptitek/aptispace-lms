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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import LoadingIndicator from "../../atoms/LoadingIndicator";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../atoms/Avatar";
import Badge from "../../atoms/Badge/Badge";
import type {
  EditableAvatarShape,
  EditableAvatarSize,
} from "./EditableAvatar.types";
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
} from "./EditableAvatar.styles";

export interface MD3AvatarProps {
  url: string;
  name?: string;
  shape?: EditableAvatarShape;
  size?: EditableAvatarSize;
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
          icon={<RestartAltIcon sx={{ fontSize: 13 }} />}
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
  shape?: EditableAvatarShape;
  size?: EditableAvatarSize;
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
      <EditIcon sx={{ fontSize: "1.1rem" }} />
      <span>{label}</span>
    </AvatarHoverOverlay>
  );
}

export function MD3AvatarDisplay(props: MD3AvatarProps) {
  const { t } = useTranslation("common");
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
        avatarShape={props.shape}
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
          showReticle={props.shape === "biometric"}
          shape={props.shape}
          height={props.height ?? "100%"}
          width={props.width ?? "100%"}
          aspectRatio={props.aspectRatio}
          objectFit={props.objectFit}
        />
        <AvatarHoverLayer
          show={isInteractive}
          shape={props.shape}
          size={props.size}
          aspectRatio={props.aspectRatio}
          label={t("avatar.edit", "EDIT")}
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
          <CloudUploadIcon />
          <span>
            {t("avatar.dropImageHint", "Drop image to set or upload avatar")}
          </span>
        </DragBadgeHint>
      ) : null}

      <InputPrefixIconHolder>
        {props.isUploading ? (
          <LoadingIndicator size={16} />
        ) : (
          <LinkIcon sx={{ fontSize: "18px" }} />
        )}
      </InputPrefixIconHolder>

      <TextInput
        id={props.inputId}
        type="text"
        value={props.value}
        placeholder={
          props.placeholder ||
          t("avatar.urlPlaceholder", "Drop image, paste, or enter URL...")
        }
        disabled={props.isUploading}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.target.value)
        }
        onKeyDown={(keyEvent: KeyboardEvent<HTMLInputElement>) => {
          if (keyEvent.key === "Escape" && props.isModified) props.onReset();
        }}
        aria-label={
          props.label ||
          t("avatar.inputAriaLabel", "Avatar image URL or drop area")
        }
      />

      <ActionsContainer>
        <Tooltip title={t("avatar.uploadFileTooltip", "Upload image file")}>
          <span>
            <ActionIconButton
              type="button"
              variantType="primary"
              onClick={props.onBrowse}
              disabled={props.isUploading}
              aria-label={t("avatar.uploadFile", "Upload avatar file")}
            >
              <CloudUploadIcon sx={{ fontSize: "18px" }} />
            </ActionIconButton>
          </span>
        </Tooltip>

        {props.isModified ? (
          <Tooltip
            title={t("avatar.resetToDefault", "Reset to default avatar")}
          >
            <span>
              <ActionIconButton
                type="button"
                variantType="secondary"
                onClick={props.onReset}
                disabled={props.isUploading}
                aria-label={t(
                  "avatar.resetToDefault",
                  "Reset avatar to default",
                )}
              >
                <RestartAltIcon sx={{ fontSize: "18px" }} />
              </ActionIconButton>
            </span>
          </Tooltip>
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
            borderRadius: "16px",
            p: 1.5,
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: 1,
            borderColor: "divider",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        <span>{t("avatar.modalTitle", "Edit Profile Avatar")}</span>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("avatar.closeModal", "Close edit avatar dialog")}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {children}
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

export function EditableAvatarModals({
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
