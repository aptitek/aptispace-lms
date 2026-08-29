import {
  useRef,
  useId,
  type ReactNode,
  type RefObject,
  type MouseEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import BiometricAvatar from "../../atoms/BiometricAvatar/BiometricAvatar";
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
  ModalBackdrop,
  ModalCard,
  ModalHeader,
} from "./EditableAvatar.styles";

function getInitials(fullName?: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarContentProps {
  url: string;
  name?: string;
  shape?: EditableAvatarShape;
}

function AvatarInner({ url, name, shape }: AvatarContentProps) {
  if (shape === "biometric") {
    return (
      <BiometricAvatar
        src={url}
        alt={name || "Biometric Avatar"}
        showReticle={true}
        height="100%"
        width="100%"
      />
    );
  }

  const initials = getInitials(name);
  return (
    <Avatar src={url} alt={name || "Avatar"}>
      {!url ? initials ? initials : <PersonIcon /> : null}
    </Avatar>
  );
}

interface MD3AvatarProps {
  url: string;
  name?: string;
  shape?: EditableAvatarShape;
  size?: EditableAvatarSize;
  editable?: boolean;
  isModified: boolean;
  isDragging: boolean;
  onAvatarClick: () => void;
  onResetClick: (e: MouseEvent) => void;
}

function MD3AvatarDisplay(props: MD3AvatarProps) {
  const isInteractive = props.editable !== false;

  return (
    <MD3AvatarContainer
      avatarShape={props.shape}
      avatarSize={props.size}
      isInteractive={isInteractive}
      isDragging={props.isDragging}
      onClick={isInteractive ? props.onAvatarClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      title={isInteractive ? "Click to edit avatar" : props.name || "Avatar"}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (isInteractive && (event.key === "Enter" || event.key === " ")) {
          props.onAvatarClick();
        }
      }}
    >
      <AvatarInner url={props.url} name={props.name} shape={props.shape} />

      {isInteractive ? (
        <AvatarHoverOverlay
          className="avatar-hover-overlay"
          avatarShape={props.shape}
          avatarSize={props.size}
        >
          <EditIcon sx={{ fontSize: "1.1rem" }} />
          <span>EDIT</span>
        </AvatarHoverOverlay>
      ) : null}

      {isInteractive && props.isModified ? (
        <Tooltip title="Reset avatar to default">
          <AvatarResetBadge
            type="button"
            onClick={props.onResetClick}
            aria-label="Reset avatar to default"
          >
            <RestartAltIcon sx={{ fontSize: "14px" }} />
          </AvatarResetBadge>
        </Tooltip>
      ) : null}
    </MD3AvatarContainer>
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
  return (
    <UnifiedDropInputArea
      isDragging={props.isDragging}
      hasError={props.hasError}
    >
      {props.isDragging ? (
        <DragBadgeHint>
          <CloudUploadIcon />
          <span>Drop image to set or upload avatar</span>
        </DragBadgeHint>
      ) : null}

      <InputPrefixIconHolder>
        {props.isUploading ? (
          <CircularProgress size={16} color="primary" />
        ) : (
          <LinkIcon sx={{ fontSize: "18px" }} />
        )}
      </InputPrefixIconHolder>

      <TextInput
        id={props.inputId}
        type="text"
        value={props.value}
        placeholder={props.placeholder || "Drop image, paste, or enter URL..."}
        disabled={props.isUploading}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onChange(event.target.value)
        }
        onKeyDown={(keyEvent: KeyboardEvent<HTMLInputElement>) => {
          if (keyEvent.key === "Escape" && props.isModified) props.onReset();
        }}
        aria-label={props.label || "Avatar image URL or drop area"}
      />

      <ActionsContainer>
        <Tooltip title="Upload image file to R2">
          <span>
            <ActionIconButton
              type="button"
              variantType="primary"
              onClick={props.onBrowse}
              disabled={props.isUploading}
              aria-label="Upload avatar file"
            >
              <CloudUploadIcon sx={{ fontSize: "18px" }} />
            </ActionIconButton>
          </span>
        </Tooltip>

        {props.isModified ? (
          <Tooltip title="Reset to default avatar">
            <span>
              <ActionIconButton
                type="button"
                variantType="secondary"
                onClick={props.onReset}
                disabled={props.isUploading}
                aria-label="Reset avatar to default"
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
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose} role="dialog" aria-modal="true">
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Edit Profile Avatar
          </Typography>
          <ActionIconButton
            type="button"
            onClick={onClose}
            aria-label="Close edit avatar dialog"
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </ActionIconButton>
        </ModalHeader>
        {children}
      </ModalCard>
    </ModalBackdrop>
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
