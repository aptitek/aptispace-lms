import { useRef, useId, type MouseEvent } from "react";
import type { EditableAvatarProps } from "./EditableAvatar.types";
import { useAvatarHandlers } from "./useAvatarHandlers";
import {
  EditableAvatarRoot,
  LabelText,
  MainContainer,
} from "./EditableAvatar.styles";
import {
  MD3AvatarDisplay,
  AvatarInputBar,
  EditableAvatarModals,
  HiddenPicker,
} from "./EditableAvatar.components";

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
      aspectRatio={props.aspectRatio}
      width={props.width}
      height={props.height}
      objectFit={props.objectFit}
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
