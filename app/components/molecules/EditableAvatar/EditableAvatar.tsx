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
import { LoadingIndicator } from "react-material-expressive";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../atoms/Avatar";
import Badge from "../../atoms/Badge/Badge";
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
  UnifiedDropInputArea,
  InputPrefixIconHolder,
  TextInput,
  ActionsContainer,
  ActionIconButton,
  HiddenFileInput,
  DragBadgeHint,
  HelperMessage,
} from "./EditableAvatar.styles";

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

function AvatarResetActionButton({
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

function MD3AvatarDisplay(props: MD3AvatarProps) {
  const { t } = useTranslation("common");
  const { isInteractive, tooltipText, showTooltip } = getAvatarTooltipConfig(
    props,
    t,
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
        isInteractive={isInteractive}
        isDragging={props.isDragging}
        onClick={isInteractive ? props.onAvatarClick : undefined}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={tooltipText || undefined}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === "Enter" || e.key === " ")) {
            props.onAvatarClick();
          }
        }}
      >
        <Avatar
          src={props.url}
          alt={props.name || "Avatar"}
          name={props.name}
          showReticle={props.shape === "biometric"}
          shape={props.shape}
          height="100%"
          width="100%"
        />
        {isInteractive ? (
          <AvatarHoverOverlay
            className="avatar-hover-overlay"
            avatarShape={props.shape}
            avatarSize={props.size}
          >
            <EditIcon sx={{ fontSize: "1.1rem" }} />
            <span>{t("avatar.edit", "EDIT")}</span>
          </AvatarHoverOverlay>
        ) : null}
        {isInteractive && props.isModified ? (
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

function SimpleEditModal({
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

function HiddenPicker({
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

function EditableAvatarModals({
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

  const helperContent = (errorMessage || props.helperText) ?? undefined;

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
        <MainContainer hasPreview={hasPreview}>
          {hasPreview ? avatarDisplay : null}
          {isEditable ? inputBar : null}
        </MainContainer>
      )}

      <EditableAvatarModals
        isModalOpen={isModalOpen}
        isImageOnly={isImageOnly}
        onClose={() => setIsModalOpen(false)}
        inputBar={inputBar}
        helperContent={helperContent}
        errorMessage={errorMessage}
      />

      <HiddenPicker
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        onProcessFile={handleProcessFile}
      />
    </EditableAvatarRoot>
  );
}

export default EditableAvatar;
