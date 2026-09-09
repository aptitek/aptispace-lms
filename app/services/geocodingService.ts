import type { MapCoordinates } from "~/components/organisms/MapCard/MapCard.types";

export interface AddressSuggestion {
  label: string;
  coordinates: MapCoordinates;
  subLabel?: string;
}

export const PRESET_CAMPUS_ADDRESSES: AddressSuggestion[] = [
  {
    label: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
    coordinates: { lat: 48.7118, lon: 2.1698 },
    subLabel: "Campus Paris-Saclay • Bâtiment Alan Turing",
  },
  {
    label: "12 Rue de l'Université, 75007 Paris, France",
    coordinates: { lat: 48.8584, lon: 2.2945 },
    subLabel: "Sorbonne Innovation Campus • Pavillon Poincaré",
  },
  {
    label: "4 Place Jussieu, 75005 Paris, France",
    coordinates: { lat: 48.8472, lon: 2.3562 },
    subLabel: "Campus Pierre et Marie Curie • Sorbonne Université",
  },
  {
    label: "Route de la Rotonde, 69100 Villeurbanne, France",
    coordinates: { lat: 45.7824, lon: 4.8726 },
    subLabel: "INSA Lyon • Campus LyonTech-La Doua",
  },
  {
    label: "1 Parvis Louis Néel, 38000 Grenoble, France",
    coordinates: { lat: 45.2078, lon: 5.7067 },
    subLabel: "MINATEC Campus Innovation • Grenoble",
  },
  {
    label: "Route Cantonale, 1015 Lausanne, Suisse",
    coordinates: { lat: 46.5191, lon: 6.5668 },
    subLabel: "EPFL • École Polytechnique Fédérale de Lausanne",
  },
  {
    label: "Rämistrasse 101, 8092 Zürich, Suisse",
    coordinates: { lat: 47.3763, lon: 8.5481 },
    subLabel: "ETH Zürich • Swiss Federal Institute of Technology",
  },
];

interface PhotonFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

function formatStreetPart(properties?: PhotonFeature["properties"]): string {
  if (!properties) {
    return "";
  }
  if (properties.street) {
    const houseNumber = properties.housenumber
      ? String(properties.housenumber) + " "
      : "";
    return houseNumber + properties.street;
  }
  return properties.name ?? "";
}

function formatLocationParts(properties?: PhotonFeature["properties"]): {
  locationString: string;
  subLabelString: string;
} {
  if (!properties) {
    return { locationString: "", subLabelString: "" };
  }
  const city = properties.city ?? "";
  const postcode = properties.postcode ?? "";
  const country = properties.country ?? "";
  const locationParts = [postcode, city, country].filter(Boolean);
  const subLabelParts = [city, country].filter(Boolean);
  return {
    locationString: locationParts.join(" "),
    subLabelString: subLabelParts.join(", "),
  };
}

function normalizePhotonFeature(
  feature: PhotonFeature,
): AddressSuggestion | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) {
    return null;
  }
  const [longitude, latitude] = coords;
  const props = feature.properties;
  const streetPart = formatStreetPart(props);
  const { locationString, subLabelString } = formatLocationParts(props);

  let formattedAddress = streetPart;
  if (locationString) {
    formattedAddress = streetPart
      ? streetPart + ", " + locationString
      : locationString;
  }

  if (!formattedAddress.trim()) {
    return null;
  }

  return {
    label: formattedAddress,
    coordinates: { lat: latitude, lon: longitude },
    subLabel: subLabelString,
  };
}

async function fetchPhotonSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const endpoint = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=5`;
    const response = await fetch(endpoint, {
      signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    const responseJson = (await response.json()) as PhotonResponse;
    const features = responseJson.features || [];
    const results: AddressSuggestion[] = [];

    for (const feature of features) {
      const suggestion = normalizePhotonFeature(feature);
      if (suggestion) {
        results.push(suggestion);
      }
    }
    return results;
  } catch {
    return [];
  }
}

function mergeAddressSuggestions(
  presetList: AddressSuggestion[],
  externalList: AddressSuggestion[],
): AddressSuggestion[] {
  const combinedMap = new Map<string, AddressSuggestion>();
  for (const preset of presetList) {
    combinedMap.set(preset.label.toLowerCase(), preset);
  }
  for (const external of externalList) {
    const key = external.label.toLowerCase();
    if (!combinedMap.has(key)) {
      combinedMap.set(key, external);
    }
  }
  return Array.from(combinedMap.values()).slice(0, 6);
}

export async function searchAddressSuggestions(
  query: string,
  signal?: AbortSignal,
  customGeocodeService?: (query: string) => Promise<AddressSuggestion[]>,
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return PRESET_CAMPUS_ADDRESSES.slice(0, 5);
  }

  if (customGeocodeService) {
    try {
      return await customGeocodeService(query);
    } catch {
      // fallback to presets
    }
  }

  const matchingPresets = PRESET_CAMPUS_ADDRESSES.filter((preset) => {
    const fullText = (
      preset.label +
      " " +
      (preset.subLabel ?? "")
    ).toLowerCase();
    return fullText.includes(trimmed);
  });

  if (matchingPresets.length >= 3) {
    return matchingPresets;
  }

  const isBrowserEnv =
    typeof window !== "undefined" && typeof fetch === "function";
  if (!isBrowserEnv) {
    return matchingPresets;
  }

  const externalSuggestions = await fetchPhotonSuggestions(query, signal);
  if (externalSuggestions.length === 0) {
    return matchingPresets;
  }

  return mergeAddressSuggestions(matchingPresets, externalSuggestions);
}

export async function geocodeAddress(
  query: string,
  signal?: AbortSignal,
): Promise<MapCoordinates | null> {
  const suggestions = await searchAddressSuggestions(query, signal);
  if (suggestions.length > 0) {
    return suggestions[0].coordinates;
  }
  return null;
}
