import { useState, useEffect, useCallback, type RefObject } from "react";
import type { MapRef } from "~/components/atoms/Map";
import { captureMapSnapshot } from "./mapSnapshotHelper";

export interface UseUnfoldLifecycleOptions {
  initialFolded: boolean;
  pitch: number;
  bearing: number;
  zoom: number;
  effectiveCoords: { lon: number; lat: number };
  onFoldChange?: (isFolded: boolean) => void;
  mapRef: RefObject<MapRef | null>;
}

export function useUnfoldLifecycle(options: UseUnfoldLifecycleOptions) {
  const {
    initialFolded,
    pitch,
    bearing,
    zoom,
    effectiveCoords,
    onFoldChange,
    mapRef,
  } = options;

  const [isFolded, setIsFolded] = useState<boolean>(true);
  const [hasMovedTo3D, setHasMovedTo3D] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const captureSnapshot = useCallback(() => {
    try {
      const canvas = mapRef.current?.getCanvas?.();
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const url = captureMapSnapshot(canvas);
        if (url) {
          setSnapshotUrl(url);
          return true;
        }
      }
    } catch {
      // Ignore capture error
    }
    return false;
  }, [mapRef]);

  // Initial sequence: start flat & folded, then unfold, and transition to 3D
  useEffect(() => {
    if (initialFolded) {
      setIsFolded(true);
      setShowOverlay(true);
      setHasMovedTo3D(false);
      return;
    }

    setIsFolded(true);
    setShowOverlay(true);
    setHasMovedTo3D(false);

    const timer = setTimeout(() => {
      setIsFolded(false);
      onFoldChange?.(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [initialFolded, onFoldChange]);

  // Periodic capture attempt when map becomes ready
  useEffect(() => {
    const timer = setTimeout(captureSnapshot, 300);
    return () => clearTimeout(timer);
  }, [effectiveCoords, captureSnapshot]);

  const handleUnfoldDone = useCallback(() => {
    setShowOverlay(false);
    setHasMovedTo3D(true);
    try {
      mapRef.current?.easeTo({
        pitch,
        bearing,
        duration: 1600,
      });
      mapRef.current?.resize();
    } catch {
      // Map instance may still be initializing
    }
  }, [mapRef, pitch, bearing]);

  const foldUp = useCallback(() => {
    try {
      captureSnapshot();
      mapRef.current?.easeTo({ pitch: 0, bearing: 0, duration: 250 });
    } catch {
      // Ignore easeTo error
    }
    setShowOverlay(true);
    setHasMovedTo3D(false);
    setIsFolded(true);
    onFoldChange?.(true);
  }, [mapRef, onFoldChange, captureSnapshot]);

  const unfoldDown = useCallback(() => {
    setShowOverlay(true);
    setIsFolded(false);
    onFoldChange?.(false);
    setTimeout(handleUnfoldDone, 850);
  }, [onFoldChange, handleUnfoldDone]);

  const handleToggleFold = useCallback(() => {
    if (!isFolded) {
      foldUp();
    } else {
      unfoldDown();
    }
  }, [isFolded, foldUp, unfoldDown]);

  const handleResetZoom = useCallback(() => {
    setHasMovedTo3D(true);
    setShowOverlay(false);
    setIsFolded(false);
    mapRef.current?.flyTo({
      center: [effectiveCoords.lon, effectiveCoords.lat],
      zoom,
      pitch,
      bearing,
    });
  }, [mapRef, effectiveCoords, zoom, pitch, bearing]);

  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap?.();
    if (map) {
      map.once("idle", captureSnapshot);
      map.once("render", captureSnapshot);
    }
    setTimeout(captureSnapshot, 100);
    setTimeout(captureSnapshot, 350);
    setTimeout(captureSnapshot, 800);
    try {
      mapRef.current?.resize();
    } catch {
      // Ignore resize error
    }
  }, [mapRef, captureSnapshot]);

  return {
    isFolded,
    hasMovedTo3D,
    showOverlay,
    snapshotUrl,
    handleUnfoldDone,
    handleToggleFold,
    handleResetZoom,
    handleMapLoad,
  };
}
