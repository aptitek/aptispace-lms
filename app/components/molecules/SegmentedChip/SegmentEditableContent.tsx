import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import type { SegmentedChipSize, ChipSegment } from "./SegmentedChip.types";
import {
  SegmentInlineInput,
  SegmentContentWrapper,
} from "./SegmentedChip.styles";

export interface SegmentEditableContentProps {
  segment: ChipSegment;
  size: SegmentedChipSize;
  testId: string;
  isEditable: boolean;
  editTrigger?: "click" | "doubleClick";
  onCommit: (newLabel: string) => void;
  disabled?: boolean;
}

interface SegmentActiveInputProps {
  initialText: string;
  size: SegmentedChipSize;
  segment: ChipSegment;
  testId: string;
  onCommit: (newLabel: string) => void;
  onCancel: () => void;
}

function resolveInitialText(labelNode: ReactNode): string {
  if (typeof labelNode === "string" || typeof labelNode === "number") {
    return String(labelNode);
  }
  return "";
}

function SegmentActiveInput(inputProps: SegmentActiveInputProps) {
  const { initialText, size, segment, testId, onCommit, onCancel } = inputProps;
  const [currentText, setCurrentText] = useState<string>(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleCommit = () => {
    const trimmed = currentText.trim();
    if (trimmed !== initialText) {
      onCommit(trimmed);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      handleCommit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  const isBold =
    segment.bold ||
    Boolean(segment.fontWeight && Number(segment.fontWeight) >= 700);

  return (
    <>
      {segment.icon}
      <SegmentInlineInput
        ref={inputRef}
        type="text"
        value={currentText}
        size={Math.max(1, currentText.length || 1)}
        $size={size}
        $bold={isBold}
        $mono={segment.mono}
        $color={segment.color}
        onChange={(event) => setCurrentText(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleCommit}
        onClick={(event) => event.stopPropagation()}
        placeholder={segment.editPlaceholder}
        aria-label={
          segment.editPlaceholder ||
          `Edit segment ${segment.id ?? initialText}`
        }
        data-testid={`${testId}-input`}
      />
    </>
  );
}

export function SegmentEditableContent(props: SegmentEditableContentProps) {
  const {
    segment,
    size,
    testId,
    isEditable,
    editTrigger = "click",
    onCommit,
    disabled = false,
  } = props;

  const initialText = resolveInitialText(segment.label);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing && !disabled) {
    return (
      <SegmentActiveInput
        initialText={initialText}
        size={size}
        segment={segment}
        testId={testId}
        onCommit={(updatedText) => {
          setIsEditing(false);
          onCommit(updatedText);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const handleStartEditing = (
    event: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>,
  ) => {
    if (!isEditable || disabled) return;
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (editTrigger === "click") {
      handleStartEditing(event);
    }
  };

  const handleDoubleClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (editTrigger === "doubleClick") {
      handleStartEditing(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "F2") {
      event.preventDefault();
      handleStartEditing(event);
    }
  };

  if (!isEditable || disabled) {
    return (
      <SegmentContentWrapper
        $isEditable={false}
        data-testid={`${testId}-content`}
      >
        {segment.icon}
        {segment.label}
      </SegmentContentWrapper>
    );
  }

  const ariaLabel =
    segment.editPlaceholder ||
    `Edit ${typeof segment.label === "string" ? segment.label : segment.id || "segment"}`;

  return (
    <SegmentContentWrapper
      $isEditable
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      data-testid={`${testId}-content`}
    >
      {segment.icon}
      {segment.label}
    </SegmentContentWrapper>
  );
}

export default SegmentEditableContent;
