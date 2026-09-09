import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchAddressSuggestions,
  geocodeAddress,
  PRESET_CAMPUS_ADDRESSES,
} from "./geocodingService";

describe("geocodingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns default preset campus addresses when query is empty", async () => {
    const suggestions = await searchAddressSuggestions("");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].label).toContain("Rue Noetzlin");
    expect(suggestions[0].coordinates.lat).toBeCloseTo(48.7118, 3);
  });

  it("filters preset campus addresses matching Saclay keyword", async () => {
    const suggestions = await searchAddressSuggestions("Saclay");
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].label).toContain("Gif-sur-Yvette");
    expect(suggestions[0].coordinates.lat).toBeCloseTo(48.7118, 3);
    expect(suggestions[0].coordinates.lon).toBeCloseTo(2.1698, 3);
  });

  it("filters preset campus addresses matching Sorbonne keyword", async () => {
    const suggestions = await searchAddressSuggestions("Sorbonne");
    expect(suggestions.length).toBeGreaterThan(0);
    const hasSorbonne = suggestions.some(
      (suggestion) =>
        suggestion.label.includes("Université") ||
        (suggestion.subLabel && suggestion.subLabel.includes("Sorbonne"))
    );
    expect(hasSorbonne).toBe(true);
  });

  it("geocodes address string to map coordinates", async () => {
    const coords = await geocodeAddress("4 Place Jussieu, 75005 Paris, France");
    expect(coords).toBeDefined();
    expect(coords?.lat).toBeCloseTo(48.8472, 3);
    expect(coords?.lon).toBeCloseTo(2.3562, 3);
  });

  it("supports custom geocode provider override", async () => {
    const mockCustomGeocode = vi.fn().mockResolvedValue([
      {
        label: "Custom Campus Center, Lyon",
        coordinates: { lat: 45.75, lon: 4.85 },
        subLabel: "Lyon Innovation",
      },
    ]);

    const suggestions = await searchAddressSuggestions(
      "Custom Campus",
      undefined,
      mockCustomGeocode
    );

    expect(mockCustomGeocode).toHaveBeenCalledWith("Custom Campus");
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].label).toBe("Custom Campus Center, Lyon");
    expect(suggestions[0].coordinates.lat).toBe(45.75);
  });

  it("exports all preset campus addresses with valid coordinates", () => {
    for (const preset of PRESET_CAMPUS_ADDRESSES) {
      expect(preset.label).toBeDefined();
      expect(preset.coordinates.lat).toBeTypeOf("number");
      expect(preset.coordinates.lon).toBeTypeOf("number");
      expect(preset.coordinates.lat).toBeGreaterThan(40);
      expect(preset.coordinates.lon).toBeGreaterThan(1);
    }
  });
});
