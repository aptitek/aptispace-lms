import {
  useState,
  useCallback,
  type DragEvent,
  type ClipboardEvent,
} from "react";
import type { UploadResponsePayload } from "./EditableAvatar.types";

async function defaultR2Uploader(
  targetFile: File,
  endpointUrl: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", targetFile);

  const response = await fetch(endpointUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = (await response
      .json()
      .catch(() => ({}))) as UploadResponsePayload;
    throw new Error(errorPayload.error || "Avatar upload failed");
  }

  const resultPayload = (await response.json()) as UploadResponsePayload;
  if (!resultPayload.url) {
    throw new Error("Invalid upload response payload from server");
  }

  return resultPayload.url;
}

function findClipboardImageFile(
  clipboardEntries?: DataTransferItemList,
): File | null {
  if (!clipboardEntries) return null;
  for (let index = 0; index < clipboardEntries.length; index += 1) {
    const entry = clipboardEntries[index];
    if (entry.type.startsWith("image/")) {
      const parsedFile = entry.getAsFile();
      if (parsedFile) return parsedFile;
    }
  }
  return null;
}

export interface UseAvatarHandlersOptions {
  value?: string;
  defaultValue?: string;
  onChange?: (nextUrl: string) => void;
  onReset?: () => void;
  onUpload?: (file: File) => Promise<string>;
  uploadEndpoint?: string;
  editable?: boolean;
}

export function useAvatarHandlers(options: UseAvatarHandlersOptions) {
  const {
    value,
    defaultValue = "",
    onChange,
    onReset,
    onUpload,
    uploadEndpoint = "/api/avatar/upload",
    editable = true,
  } = options;

  const [internalValue, setInternalValue] = useState<string>(
    value ?? defaultValue,
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeAvatarUrl = value !== undefined ? value : internalValue;
  const isModified = activeAvatarUrl !== defaultValue;

  const updateAvatarUrl = useCallback(
    (nextUrl: string) => {
      setErrorMessage(null);
      if (value === undefined) setInternalValue(nextUrl);
      onChange?.(nextUrl);
    },
    [value, onChange],
  );

  const handleProcessFile = useCallback(
    async (pickedFile: File) => {
      if (!editable) return;
      if (!pickedFile.type.startsWith("image/")) {
        setErrorMessage(
          "Please select a valid image file (PNG, JPG, WebP, SVG)",
        );
        return;
      }
      setIsUploading(true);
      setErrorMessage(null);
      try {
        const uploadedUrl = onUpload
          ? await onUpload(pickedFile)
          : await defaultR2Uploader(pickedFile, uploadEndpoint);
        updateAvatarUrl(uploadedUrl);
      } catch (uploadError) {
        const messageText =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload avatar image";
        setErrorMessage(messageText);
      } finally {
        setIsUploading(false);
      }
    },
    [editable, onUpload, uploadEndpoint, updateAvatarUrl],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (editable && !isUploading && !isDragging) setIsDragging(true);
    },
    [editable, isUploading, isDragging],
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (dropEvent: DragEvent<HTMLDivElement>) => {
      dropEvent.preventDefault();
      setIsDragging(false);
      if (!editable || isUploading) return;

      const droppedFiles = dropEvent.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        handleProcessFile(droppedFiles[0]);
        return;
      }
      const droppedText = dropEvent.dataTransfer.getData("text/plain");
      if (droppedText) updateAvatarUrl(droppedText.trim());
    },
    [editable, isUploading, handleProcessFile, updateAvatarUrl],
  );

  const handlePaste = useCallback(
    (pasteEvent: ClipboardEvent<HTMLDivElement>) => {
      if (!editable || isUploading) return;
      const fileFromPaste = findClipboardImageFile(
        pasteEvent.clipboardData?.items,
      );
      if (fileFromPaste) {
        pasteEvent.preventDefault();
        handleProcessFile(fileFromPaste);
        return;
      }
      const pastedText = pasteEvent.clipboardData.getData("text");
      if (pastedText && pastedText.match(/^(https?:\/\/|data:image\/|\/)/i)) {
        pasteEvent.preventDefault();
        updateAvatarUrl(pastedText.trim());
      }
    },
    [editable, isUploading, handleProcessFile, updateAvatarUrl],
  );

  const handleReset = useCallback(() => {
    if (!editable || isUploading) return;
    setErrorMessage(null);
    updateAvatarUrl(defaultValue);
    onReset?.();
  }, [editable, isUploading, defaultValue, updateAvatarUrl, onReset]);

  return {
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
  };
}
