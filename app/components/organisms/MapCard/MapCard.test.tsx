import type * as ReactType from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import MapCard from "./index";
import "~/i18n";

const theme = createTheme();

interface MockMapProps {
  children?: ReactType.ReactNode;
  initialViewState?: { latitude?: number; longitude?: number; zoom?: number };
}

interface MockMarkerProps {
  children?: ReactType.ReactNode;
  longitude?: number;
  latitude?: number;
}

const mockDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const mockCanvasObj = {
  toDataURL: () => mockDataUrl,
};

const mockMapHandlers = {
  dragPan: { enable: vi.fn(), disable: vi.fn() },
  scrollZoom: { enable: vi.fn(), disable: vi.fn() },
  doubleClickZoom: { enable: vi.fn(), disable: vi.fn() },
  boxZoom: { enable: vi.fn(), disable: vi.fn() },
};

const createMockMapHandle = () => ({
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  flyTo: vi.fn(),
  easeTo: vi.fn(),
  resize: vi.fn(),
  getCanvas: () => mockCanvasObj,
  getMap: () => mockMapHandlers,
});

vi.mock("react-map-gl/maplibre", async () => {
  const actualReact = await vi.importActual<typeof ReactType>("react");
  const MockMap = actualReact.forwardRef<
    {
      zoomIn: () => void;
      zoomOut: () => void;
      flyTo: () => void;
      easeTo: () => void;
      resize: () => void;
      getCanvas?: () => { toDataURL: () => string };
    },
    MockMapProps
  >(({ children, initialViewState }, ref) => {
    actualReact.useImperativeHandle(ref, createMockMapHandle);
    return (
      <div
        data-testid="maplibre-gl-map"
        data-lat={initialViewState?.latitude}
        data-lon={initialViewState?.longitude}
        data-zoom={initialViewState?.zoom}
      >
        {children}
      </div>
    );
  });
  MockMap.displayName = "MockMap";

  const MockMarker = ({ children, longitude, latitude }: MockMarkerProps) => (
    <div data-testid="maplibre-marker" data-lat={latitude} data-lon={longitude}>
      {children}
    </div>
  );

  return {
    default: MockMap,
    Marker: MockMarker,
    NavigationControl: () => <div data-testid="maplibre-nav-control" />,
  };
});

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("MapCard Organism", () => {
  const defaultAddress = "Rue Noetzlin, 91190 Gif-sur-Yvette, France";
  const defaultCoords = { lat: 48.7118, lon: 2.1698 };

  beforeAll(() => {
    Object.defineProperty(HTMLIFrameElement.prototype, "src", {
      get() {
        return this.getAttribute("data-src") || "";
      },
      set(val) {
        this.setAttribute("data-src", val);
      },
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
      writable: true,
    });
  });

  describe("Component Rendering", () => {
    it("renders prominent segmented chip with campus, building, floor, and room", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          coordinates={defaultCoords}
        />,
      );

      // Location context chip and prominent hero room chip
      expect(screen.getByTestId("location-chip")).toBeDefined();
      expect(screen.getByTestId("prominent-wayfinding-chip")).toBeDefined();
      // Segments
      expect(screen.getByTestId("seg-campus").textContent).toContain(
        "Paris-Saclay",
      );
      expect(screen.getByTestId("seg-building").textContent).toContain(
        "Alan Turing",
      );
      expect(screen.getByTestId("seg-floor").textContent).toContain("3");
      expect(screen.getByTestId("seg-room").textContent).toContain("02");
    });

    it("renders custom amphitheater roomName when provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          roomName="Amphithéâtre Alan Turing"
        />,
      );

      expect(screen.getByTestId("seg-room").textContent).toContain(
        "Amphithéâtre Alan Turing",
      );
    });

    it("renders optional access segmented chip when doorCode or accessType are provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          accessType="code"
          instructions="Badge RFID requis après 18h."
          showInstructionBanner={true}
        />,
      );

      // Access chip container
      expect(screen.getByTestId("optional-access-chip")).toBeDefined();
      expect(screen.getByTestId("seg-doorcode").textContent).toContain(
        "*4829#",
      );
      expect(screen.getByTestId("seg-access-badge")).toBeDefined();
      expect(screen.queryByTestId("seg-instructions")).toBeNull();
      expect(screen.getByTestId("instruction-note").textContent).toContain(
        "Badge RFID requis après 18h.",
      );
    });

    it("does not render instruction note banner by default without showInstructionBanner", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          doorCode="*4829#"
          instructions="Badge RFID requis après 18h."
        />,
      );

      expect(screen.queryByTestId("instruction-note")).toBeNull();
    });

    it("does not render optional access chip when no access info is provided", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
        />,
      );

      expect(screen.queryByTestId("optional-access-chip")).toBeNull();
      expect(screen.queryByTestId("instruction-note")).toBeNull();
    });

    it("allows copying door code by clicking the doorcode segment", async () => {
      const onCopyDoorCode = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          room="302"
          doorCode="*4829#"
          onCopyDoorCode={onCopyDoorCode}
        />,
      );

      const doorCodeSegment = screen.getByTestId("seg-doorcode");
      fireEvent.click(doorCodeSegment);

      expect(onCopyDoorCode).toHaveBeenCalledWith("*4829#");
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("*4829#");
      await waitFor(() => {
        expect(doorCodeSegment.textContent).toContain("Copié !");
      });
    });

    it("renders MapLibre vector map container within 3D folding paper canvas", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          zoom={16}
        />,
      );

      expect(screen.getByTestId("map-perspective-wrapper")).toBeDefined();
      expect(screen.getByTestId("folding-paper-canvas")).toBeDefined();
      expect(screen.getByTestId("maplibre-container")).toBeDefined();
    });

    it("renders with custom mapStyle and narrow width layout", () => {
      const customStyle =
        "https://api.maptiler.com/maps/basic/style.json?key=test-key";
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          mapStyle={customStyle}
          mapWidth="narrow"
        />,
      );

      const wrapper = screen.getByTestId("map-perspective-wrapper");
      expect(wrapper).toBeDefined();
      expect(screen.getByTestId("maplibre-container")).toBeDefined();
    });

    it("renders campus name on map pin badge by default and supports custom pinLabel", () => {
      renderWithTheme(
        <MapCard
          campusName="Campus Condorcet"
          address={defaultAddress}
          coordinates={defaultCoords}
        />,
      );

      // In wayfinding chip, cleanCampusName produces "Condorcet"
      expect(screen.getByText("Condorcet")).toBeDefined();
      // On the pin badge, the full campus name is displayed
      expect(screen.getByTestId("map-pin-label").textContent).toBe(
        "Campus Condorcet",
      );
    });

    it("renders footer with address, copy button, and navigation FloatingActionButton", async () => {
      const onCopyAddress = vi.fn();
      const onDirectionsClick = vi.fn();

      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          onCopyAddress={onCopyAddress}
          onDirectionsClick={onDirectionsClick}
        />,
      );

      // Address display
      expect(screen.getByTestId("address-text").textContent).toContain(
        defaultAddress,
      );

      // Copy Address Button
      const copyBtn = screen.getByTestId("btn-copy-address");
      expect(copyBtn).toBeDefined();
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        defaultAddress,
      );
      expect(onCopyAddress).toHaveBeenCalledWith(defaultAddress);

      // Navigation FAB
      const navFab = screen.getByTestId("fab-navigate-gps");
      expect(navFab).toBeDefined();
      fireEvent.click(navFab);
      expect(onDirectionsClick).toHaveBeenCalledWith(
        defaultCoords,
        defaultAddress,
      );
    });

    it("does not render viewport controls overlay by default", () => {
      renderWithTheme(
        <MapCard address={defaultAddress} coordinates={defaultCoords} />,
      );

      expect(screen.queryByTestId("map-overlay-controls")).toBeNull();
      expect(screen.queryByTestId("btn-toggle-fold")).toBeNull();
    });

    it("toggles fold state using viewport controls when showControls is true", () => {
      const onFoldChange = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          coordinates={defaultCoords}
          initialFolded={true}
          showControls={true}
          onFoldChange={onFoldChange}
        />,
      );

      const toggleFoldBtn = screen.getByTestId("btn-toggle-fold");
      expect(toggleFoldBtn).toBeDefined();
      fireEvent.click(toggleFoldBtn);
      expect(onFoldChange).toHaveBeenCalledWith(false);
    });

    it("renders wayfinding segmented chip in vertical orientation when requested", () => {
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris-Saclay"
          buildingName="Bâtiment Alan Turing"
          room="302"
          chipOrientation="vertical"
        />,
      );

      const chip = screen.getByTestId("prominent-wayfinding-chip");
      expect(chip.getAttribute("data-orientation")).toBe("vertical");
    });
  });

  describe("Editable Mode", () => {
    it("renders address in a text field when editable is true and triggers onAddressChange", () => {
      const onAddressChange = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          editable={true}
          onAddressChange={onAddressChange}
        />,
      );

      expect(screen.queryByTestId("address-text")).toBeNull();
      const addressInput = screen.getByTestId(
        "address-input",
      ) as HTMLInputElement;
      expect(addressInput).toBeDefined();
      expect(addressInput.value).toBe(defaultAddress);

      fireEvent.change(addressInput, {
        target: { value: "45 Rue de Rivoli, 75001 Paris" },
      });
      expect(onAddressChange).toHaveBeenCalledWith(
        "45 Rue de Rivoli, 75001 Paris",
      );
      expect(addressInput.value).toBe("45 Rue de Rivoli, 75001 Paris");
    });

    it("renders switch for badge in editable mode and toggles badge visibility", () => {
      const onBadgeChange = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          editable={true}
          accessType="open"
          onBadgeChange={onBadgeChange}
        />,
      );

      const badgeSwitch = screen.getByTestId("badge-switch");
      expect(badgeSwitch).toBeDefined();
      expect(screen.queryByTestId("seg-access-badge")).toBeNull();

      fireEvent.click(badgeSwitch);
      expect(onBadgeChange).toHaveBeenCalledWith(true);
      expect(screen.getByTestId("seg-access-badge")).toBeDefined();
    });

    it("renders instructions in a text field when editable is true and triggers onInstructionsChange", () => {
      const onInstructionsChange = vi.fn();
      renderWithTheme(
        <MapCard
          address={defaultAddress}
          instructions="Sonner à l'interphone"
          editable={true}
          onInstructionsChange={onInstructionsChange}
        />,
      );

      const instructionsInput = screen.getByTestId(
        "instructions-input",
      ) as HTMLInputElement;
      expect(instructionsInput).toBeDefined();
      expect(instructionsInput.value).toBe("Sonner à l'interphone");

      fireEvent.change(instructionsInput, {
        target: { value: "Badge à l'accueil" },
      });
      expect(onInstructionsChange).toHaveBeenCalledWith("Badge à l'accueil");
    });

    it("allows editing wayfinding location and room segments in place", () => {
      const onCampusChange = vi.fn();
      const onRoomChange = vi.fn();

      renderWithTheme(
        <MapCard
          address={defaultAddress}
          campusName="Campus Paris"
          buildingName="Bâtiment A"
          room="302"
          editable={true}
          onCampusChange={onCampusChange}
          onRoomChange={onRoomChange}
        />,
      );

      // Campus segment in-place edit
      const campusContent = screen.getByTestId("seg-campus-content");
      expect(campusContent).toBeDefined();
      fireEvent.click(campusContent);

      const campusInput = screen.getByTestId(
        "seg-campus-input",
      ) as HTMLInputElement;
      fireEvent.change(campusInput, { target: { value: "Campus Saclay" } });
      fireEvent.keyDown(campusInput, { key: "Enter", code: "Enter" });

      expect(onCampusChange).toHaveBeenCalledWith("Campus Saclay");

      // Room segment in-place edit
      const roomContent = screen.getByTestId("seg-room-content");
      expect(roomContent).toBeDefined();
      fireEvent.click(roomContent);

      const roomInput = screen.getByTestId(
        "seg-room-input",
      ) as HTMLInputElement;
      fireEvent.change(roomInput, { target: { value: "Amphi 1" } });
      fireEvent.keyDown(roomInput, { key: "Enter", code: "Enter" });

      expect(onRoomChange).toHaveBeenCalledWith("Amphi 1");
    });
  });
});
