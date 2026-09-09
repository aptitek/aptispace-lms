import React, { useState, useEffect, useRef, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import {
  searchAddressSuggestions,
  geocodeAddress,
  type AddressSuggestion,
} from "~/services/geocodingService";
import type { MapCoordinates } from "./MapCard.types";

export interface AddressAutocompleteProps {
  address: string;
  placeholder?: string;
  onAddressChange?: (newAddress: string) => void;
  onCoordinatesChange?: (coordinates: MapCoordinates) => void;
  customGeocodeService?: (query: string) => Promise<AddressSuggestion[]>;
}

export function AddressAutocomplete({
  address,
  placeholder,
  onAddressChange,
  onCoordinatesChange,
  customGeocodeService,
}: AddressAutocompleteProps) {
  const [options, setOptions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      try {
        const results = await searchAddressSuggestions(
          searchQuery,
          controller.signal,
          customGeocodeService
        );
        if (!controller.signal.aborted) {
          setOptions(results);
        }
      } catch {
        // Ignored on abort
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [customGeocodeService]
  );

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      onAddressChange?.(newInputValue);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        void fetchSuggestions(newInputValue);
      }, 250);
    },
    [onAddressChange, fetchSuggestions]
  );

  const handleSelectOption = useCallback(
    (
      _event: React.SyntheticEvent,
      selection: string | AddressSuggestion | null
    ) => {
      if (!selection) {
        return;
      }

      if (typeof selection === "string") {
        onAddressChange?.(selection);
        void geocodeAddress(selection).then((resolvedCoordinates) => {
          if (resolvedCoordinates) {
            onCoordinatesChange?.(resolvedCoordinates);
          }
        });
        return;
      }

      onAddressChange?.(selection.label);
      onCoordinatesChange?.(selection.coordinates);
    },
    [onAddressChange, onCoordinatesChange]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      filterOptions={(selectableOptions) => selectableOptions}
      onInputChange={handleInputChange}
      onChange={handleSelectOption}
      inputValue={address}
      loading={isLoading}
      data-testid="address-field"
      sx={{
        flex: 1,
        minWidth: 0,
        "& .MuiOutlinedInput-root": {
          fontSize: "0.8rem",
          height: 32,
          paddingRight: "8px !important",
        },
      }}
      renderOption={(optionProps, option) => {
        const suggestion =
          typeof option === "string"
            ? { label: option, coordinates: { lat: 0, lon: 0 } }
            : option;
        const { key, ...restOptionProps } = optionProps;

        return (
          <Box
            component="li"
            key={key}
            {...restOptionProps}
            data-testid="address-suggestion-item"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              py: 0.75,
              px: 1.5,
              cursor: "pointer",
            }}
          >
            <PlaceRoundedIcon
              sx={{ fontSize: 16, color: "primary.main", mt: 0.25, flexShrink: 0 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {suggestion.label}
              </Typography>
              {suggestion.subLabel && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.72rem",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {suggestion.subLabel}
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps?.htmlInput,
              "data-testid": "address-input",
            },
            input: {
              ...params.slotProps?.input,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={14} />
                  ) : null}
                  {params.slotProps?.input?.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

export default AddressAutocomplete;
