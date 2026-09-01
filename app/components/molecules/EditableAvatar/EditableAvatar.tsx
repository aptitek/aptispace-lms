import {
  useRef,
  useId,
  type ReactNode,
  type RefObject,
  type MouseEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { LoadingIndicator } from "react-material-expressive";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../atoms/Avatar";
import type {
  EditableAvatarProps,
  EditableAvatarShape,
  EditableAvatarSize,
} from "./EditableAvatar.types";
import { useAvatarHandlers } from "./useAvatarHandlers";
import {
  EditableAvatarRoot,
  LabelText,
  MainContainer,
  MD3AvatarContainer,
  AvatarHoverOverlay,
  AvatarResetBadge,
  UnifiedDropInputArea,
  InputPrefixIconHolder,
  TextInput,
  ActionsContainer,
  ActionIconButton,
  HiddenFileInput,
  DragBadgeHint,
  HelperMessage,
} from "./EditableAvatar.styles";

interface AvatarContentProps {
  url: string;
  name?: string;
  shape?: EditableAvatarShape;
}

function AvatarInner({ url, name, shape }: AvatarContentProps) {
  return (
    <Avatar
      src={url}
      alt={name || "Avatar"}
      name={name}
      showReticle={shape === "biometric"}
      shape={shape}
      height="100%"
      width="100%"
    />
  );
}

interface MD3AvatarProps {
  url: string;
  name?: string;
  shape?: EditableAvatarShape;
  size?: EditableAvatarSize;
  editable?: boolean;
  disableTooltip?: boolean;
  isModified: boolean;
  isDragging: boolean;
  onAvatarClick: () => void;
  onResetClick: (e: MouseEvent) => void;
}

interface ResetBadgeProps {
  onResetClick: (e: MouseEvent) => void;
}

function AvatarResetActionButton({ onResetClick }: ResetBadgeProps) {
  const { t } = useTranslation("common");
  const label = t("avatar.resetToDefault", "Reset avatar to default");
  return (
    <Tooltip title={label}>
      <AvatarResetBadge type="button" onClick={onResetClick} aria-label={label}>
        <RestartAltIcon sx={{ fontSize: "14px" }} />
      </AvatarResetBadge>
    </Tooltip>
  );
}

interface HoverOverlayProps {
  shape?: EditableAvatarShape;
  size?: EditableAvatarSize;
}

function AvatarHoverActionOverlay({ shape, size }: HoverOverlayProps) {
  const { t } = useTranslation("common");
  return (
    <AvatarHoverOverlay
      className="avatar-hover-overlay"
      avatarShape={shape}
      avatarSize={size}
    >
      <EditIcon sx={{ fontSize: "1.1rem" }} />
      <span>{t("avatar.edit", "EDIT")}</span>
    </AvatarHoverOverlay>
  );
}

function handleAvatarKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  isInteractive: boolean,
  onAvatarClick: () => void,
) {
  if (isInteractive && (event.key === "Enter" || event.key === " ")) {
    onAvatarClick();
  }
}

function resolveAvatarDisplayConfig(
  props: MD3AvatarProps,
  t: (key: string, fallback: string) => string,
) {
  const isInteractive = props.editable !== false;
  const tooltipText = isInteractive
    ? t("avatar.clickToEdit", "Click to edit avatar")
    : props.name || "";
  const shouldShowTooltip = !props.disableTooltip && Boolean(tooltipText);

  return {
    isInteractive,
    tooltipText,
    shouldShowTooltip,
    role: isInteractive ? ("button" as const) : undefined,
    tabIndex: isInteractive ? 0 : undefined,
    onClick: isInteractive ? props.onAvatarClick : undefined,
  };
}

function MD3AvatarDisplay(props: MD3AvatarProps) {
  const { t } = useTranslation("common");
  const config = resolveAvatarDisplayConfig(props, t);

  return (
    <Tooltip
      title={config.tooltipText}
      arrow
      placement="top"
      disableHoverListener={!config.shouldShowTooltip}
    >
      <MD3AvatarContainer
        avatarShape={props.shape}
        avatarSize={props.size}
        isInteractive={config.isInteractive}
        isDragging={props.isDragging}
        onClick={config.onClick}
        role={config.role}
        tabIndex={config.tabIndex}
        aria-label={config.tooltipText || undefined}
        onKeyDown={(event) =>
          handleAvatarKeyDown(event, config.isInteractive, props.onAvatarClick)
        }
      >
        <AvatarInner url={props.url} name={props.name} shape={props.shape} />

        {config.isInteractive ? (
          <AvatarHoverActionOverlay shape={props.shape} size={props.size} />
        ) : null}

        {config.isInteractive && props.isModified ? (
          <AvatarResetActionButton onResetClick={props.onResetClick} />
        ) : null}
      </MD3AvatarContainer>
    </Tooltip>
  );
}

interface AvatarInputBarProps {
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

function AvatarInputBar(props: AvatarInputBarProps) {
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
          <LoadingIndicator className="!size-4 [&>svg]:!size-4" />
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

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function SimpleEditModal({ isOpen, onClose, children }: SimpleModalProps) {
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

interface FilePickerProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onProcessFile: (file: File) => void;
}

function HiddenPicker({
  fileInputRef,
  isUploading,
  onProcessFile,
}: FilePickerProps) {
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

interface InlineLayoutProps {
  hasPreview?: boolean;
  isEditable?: boolean;
  avatarElement: ReactNode;
  inputBarElement: ReactNode;
}

function InlineLayout({
  hasPreview,
  isEditable,
  avatarElement,
  inputBarElement,
}: InlineLayoutProps) {
  return (
    <MainContainer hasPreview={hasPreview}>
      {hasPreview ? avatarElement : null}
      {isEditable ? inputBarElement : null}
    </MainContainer>
  );
}

export function EditableAvatar(props: EditableAvatarProps) {
  const isEditable = props.editable !== false;
  const isImageOnly = props.mode === "image-only";
  const hasPreview = props.showPreview !== false;

  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    activeAvatarUrl,
    isModified,
    isDragging,
    isUploading,
    isModalOpen,
    setIsModalOpen,
    errorMessage,
    handleDragOver,
    handleDragLeave,
    updateAvatarUrl,
    handleProcessFile,
    handleDrop,
    handlePaste,
    handleReset,
  } = useAvatarHandlers({ ...props, editable: isEditable });

  const handleAvatarClick = () => {
    if (isImageOnly) {
      setIsModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleResetBadge = (e: MouseEvent) => {
    e.stopPropagation();
    handleReset();
  };

  const avatarDisplay = (
    <MD3AvatarDisplay
      url={activeAvatarUrl}
      name={props.name}
      shape={props.shape}
      size={props.size}
      editable={isEditable}
      disableTooltip={props.disableTooltip}
      isModified={isModified}
      isDragging={isDragging}
      onAvatarClick={handleAvatarClick}
      onResetClick={handleResetBadge}
    />
  );

  const inputBar = (
    <AvatarInputBar
      inputId={inputId}
      value={activeAvatarUrl}
      placeholder={props.placeholder}
      label={props.label}
      isDragging={isDragging}
      hasError={Boolean(errorMessage)}
      isUploading={isUploading}
      isModified={isModified}
      extraActions={props.extraActions}
      onChange={updateAvatarUrl}
      onBrowse={() => fileInputRef.current?.click()}
      onReset={handleReset}
    />
  );

  const helperContent = errorMessage || props.helperText;

  return (
    <EditableAvatarRoot
      className={props.className}
      data-testid={props.testId || "editable-avatar"}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {props.label && !isImageOnly ? (
        <LabelText htmlFor={inputId}>{props.label}</LabelText>
      ) : null}

      {isImageOnly ? (
        avatarDisplay
      ) : (
        <InlineLayout
          hasPreview={hasPreview}
          isEditable={isEditable}
          avatarElement={avatarDisplay}
          inputBarElement={inputBar}
        />
      )}

      <SimpleEditModal
        isOpen={isModalOpen && isImageOnly}
        onClose={() => setIsModalOpen(false)}
      >
        {inputBar}
        {helperContent ? (
          <HelperMessage isError={Boolean(errorMessage)}>
            {helperContent}
          </HelperMessage>
        ) : null}
      </SimpleEditModal>

      <HiddenPicker
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        onProcessFile={handleProcessFile}
      />

      {!isImageOnly && helperContent ? (
        <HelperMessage isError={Boolean(errorMessage)}>
          {helperContent}
        </HelperMessage>
      ) : null}
    </EditableAvatarRoot>
  );
}

export default EditableAvatar;
