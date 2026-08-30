import { describe, it, expect } from "vitest";
import React from "react";
import { Card } from "deckfx";

describe("deckfx Integration", () => {
  it("exports Card component", () => {
    expect(Card).toBeDefined();
    expect(typeof Card).toBe("object");
  });

  it("creates Card element with holographic props and layers", () => {
    const el = React.createElement(
      Card,
      {
        holographic: {
          variant: "rainbow",
          holoStrength: 1.0,
        },
        layers: [
          {
            src: "test.png",
            holographic: true,
          },
        ],
      },
      React.createElement("div", null, "Card Content"),
    );
    expect(el).toBeDefined();
    const holo = el.props.holographic;
    expect(
      typeof holo === "object" && holo !== null ? holo.variant : null,
    ).toBe("rainbow");
    expect(el.props.layers).toHaveLength(1);
  });
});
