import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddressAutocomplete from "./AddressAutocomplete";
import type { MapCoordinates } from "./MapCard.types";

const testTheme = createTheme();

function renderComponent(props: React.ComponentProps<typeof AddressAutocomplete>) {
  return render(
    <ThemeProvider theme={testTheme}>
      <AddressAutocomplete {...props} />
    </ThemeProvider>
  );
}

describe("AddressAutocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders address input with initial value and placeholder", () => {
    renderComponent({
      address: "Rue Noetzlin, 91190 Gif-sur-Yvette, France",
      placeholder: "Entrez une adresse...",
    });

    const input = screen.getByTestId("address-input") as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.value).toBe("Rue Noetzlin, 91190 Gif-sur-Yvette, France");
    expect(input.placeholder).toBe("Entrez une adresse...");
  });

  it("calls onAddressChange when typing into the input", () => {
    const onAddressChange = vi.fn();
    renderComponent({
      address: "Rue Noetzlin",
      onAddressChange,
    });

    const input = screen.getByTestId("address-input");
    fireEvent.change(input, { target: { value: "12 Rue de l'Université" } });

    expect(onAddressChange).toHaveBeenCalledWith("12 Rue de l'Université");
  });

  it("selects a suggestion and triggers onAddressChange and onCoordinatesChange", async () => {
    const onAddressChange = vi.fn();
    const onCoordinatesChange = vi.fn();
    const customCoords: MapCoordinates = { lat: 48.8584, lon: 2.2945 };

    const mockGeocode = vi.fn().mockResolvedValue([
      {
        label: "12 Rue de l'Université, 75007 Paris, France",
        coordinates: customCoords,
        subLabel: "Sorbonne Campus",
      },
    ]);

    renderComponent({
      address: "",
      onAddressChange,
      onCoordinatesChange,
      customGeocodeService: mockGeocode,
    });

    const input = screen.getByTestId("address-input");
    fireEvent.change(input, { target: { value: "Sorbonne" } });

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockGeocode).toHaveBeenCalledWith("Sorbonne");
      },
      { timeout: 1000 }
    );

    // Open popup options
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    await waitFor(() => {
      const option = screen.getByText("12 Rue de l'Université, 75007 Paris, France");
      expect(option).toBeDefined();
      fireEvent.click(option);
    });

    expect(onAddressChange).toHaveBeenCalledWith(
      "12 Rue de l'Université, 75007 Paris, France"
    );
    expect(onCoordinatesChange).toHaveBeenCalledWith(customCoords);
  });

  it("handles freeSolo text entry with geocoding fallback", async () => {
    const onAddressChange = vi.fn();
    const onCoordinatesChange = vi.fn();

    renderComponent({
      address: "",
      onAddressChange,
      onCoordinatesChange,
    });

    const input = screen.getByTestId("address-input");
    fireEvent.change(input, {
      target: { value: "4 Place Jussieu, 75005 Paris, France" },
    });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onAddressChange).toHaveBeenCalled();
  });
});
