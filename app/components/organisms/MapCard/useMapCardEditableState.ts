import { useState, useEffect, useCallback } from "react";
import type { AccessType, MapCoordinates } from "./MapCard.types";

export interface UseMapCardEditableParams {
  address: string;
  coordinates?: MapCoordinates;
  campusName?: string;
  buildingName?: string;
  floor?: string | number;
  room?: string;
  doorCode?: string;
  instructions?: string;
  hasBadge?: boolean;
  accessType?: AccessType;
  onAddressChange?: (newAddress: string) => void;
  onCoordinatesChange?: (newCoordinates: MapCoordinates) => void;
  onCampusChange?: (newCampus: string) => void;
  onBuildingChange?: (newBuilding: string) => void;
  onFloorChange?: (newFloor: string) => void;
  onRoomChange?: (newRoom: string) => void;
  onDoorCodeChange?: (newDoorCode: string) => void;
  onBadgeChange?: (hasBadgeChecked: boolean) => void;
  onInstructionsChange?: (newInstructions: string) => void;
}

export function computeBadgeRequirement(
  hasBadge?: boolean,
  accessType?: AccessType,
  instructions?: string,
): boolean {
  if (hasBadge !== undefined) {
    return hasBadge;
  }
  if (accessType === "badge") {
    return true;
  }
  return Boolean(instructions && /(badge|rfid|pass|carte)/i.test(instructions));
}

export function useMapCardEditableState(params: UseMapCardEditableParams) {
  const {
    address,
    coordinates,
    campusName,
    buildingName,
    floor,
    room,
    doorCode,
    instructions,
    hasBadge,
    accessType,
    onAddressChange,
    onCoordinatesChange,
    onCampusChange,
    onBuildingChange,
    onFloorChange,
    onRoomChange,
    onDoorCodeChange,
    onBadgeChange,
    onInstructionsChange,
  } = params;

  const [localAddress, setLocalAddress] = useState<string>(address);
  const [localCoordinates, setLocalCoordinates] = useState<
    MapCoordinates | undefined
  >(coordinates);
  const [localCampus, setLocalCampus] = useState<string | undefined>(
    campusName,
  );
  const [localBuilding, setLocalBuilding] = useState<string | undefined>(
    buildingName,
  );
  const [localFloor, setLocalFloor] = useState<string | number | undefined>(
    floor,
  );
  const [localRoom, setLocalRoom] = useState<string | undefined>(room);
  const [localDoorCode, setLocalDoorCode] = useState<string | undefined>(
    doorCode,
  );
  const [localInstructions, setLocalInstructions] = useState<
    string | undefined
  >(instructions);
  const [localHasBadge, setLocalHasBadge] = useState<boolean>(() =>
    computeBadgeRequirement(hasBadge, accessType, instructions),
  );

  useEffect(() => {
    setLocalAddress(address);
  }, [address]);

  useEffect(() => {
    setLocalCoordinates(coordinates);
  }, [coordinates]);

  useEffect(() => {
    setLocalCampus(campusName);
  }, [campusName]);

  useEffect(() => {
    setLocalBuilding(buildingName);
  }, [buildingName]);

  useEffect(() => {
    setLocalFloor(floor);
  }, [floor]);

  useEffect(() => {
    setLocalRoom(room);
  }, [room]);

  useEffect(() => {
    setLocalDoorCode(doorCode);
  }, [doorCode]);

  useEffect(() => {
    setLocalInstructions(instructions);
  }, [instructions]);

  useEffect(() => {
    setLocalHasBadge(
      computeBadgeRequirement(hasBadge, accessType, instructions),
    );
  }, [hasBadge, accessType, instructions]);

  const handleAddressChange = useCallback(
    (newAddress: string) => {
      setLocalAddress(newAddress);
      onAddressChange?.(newAddress);
    },
    [onAddressChange],
  );

  const handleCoordinatesChange = useCallback(
    (newCoordinates: MapCoordinates) => {
      setLocalCoordinates(newCoordinates);
      onCoordinatesChange?.(newCoordinates);
    },
    [onCoordinatesChange],
  );

  const handleBadgeChange = useCallback(
    (hasBadgeChecked: boolean) => {
      setLocalHasBadge(hasBadgeChecked);
      onBadgeChange?.(hasBadgeChecked);
    },
    [onBadgeChange],
  );

  const handleInstructionsChange = useCallback(
    (newInstructions: string) => {
      setLocalInstructions(newInstructions);
      onInstructionsChange?.(newInstructions);
    },
    [onInstructionsChange],
  );

  const handleCampusChange = useCallback(
    (newCampus: string) => {
      setLocalCampus(newCampus);
      onCampusChange?.(newCampus);
    },
    [onCampusChange],
  );

  const handleBuildingChange = useCallback(
    (newBuilding: string) => {
      setLocalBuilding(newBuilding);
      onBuildingChange?.(newBuilding);
    },
    [onBuildingChange],
  );

  const handleFloorChange = useCallback(
    (newFloor: string) => {
      setLocalFloor(newFloor);
      onFloorChange?.(newFloor);
    },
    [onFloorChange],
  );

  const handleRoomChange = useCallback(
    (newRoom: string) => {
      setLocalRoom(newRoom);
      onRoomChange?.(newRoom);
    },
    [onRoomChange],
  );

  const handleDoorCodeChange = useCallback(
    (newDoorCode: string) => {
      setLocalDoorCode(newDoorCode);
      onDoorCodeChange?.(newDoorCode);
    },
    [onDoorCodeChange],
  );

  return {
    localAddress,
    localCoordinates,
    localCampus,
    localBuilding,
    localFloor,
    localRoom,
    localDoorCode,
    localInstructions,
    localHasBadge,
    handleAddressChange,
    handleCoordinatesChange,
    handleCampusChange,
    handleBuildingChange,
    handleFloorChange,
    handleRoomChange,
    handleDoorCodeChange,
    handleBadgeChange,
    handleInstructionsChange,
  };
}
