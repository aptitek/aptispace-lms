import { describe, it, expect } from "vitest";
import MD3DeckCard, {
  MD3CardHeader,
  MD3CardHeadline,
  MD3CardSubhead,
  MD3CardContent,
  MD3CardActions,
  MD3CardMedia,
} from "./MD3DeckCard";

describe("MD3DeckCard component", () => {
  it("exports MD3DeckCard and MD3 subcomponents", () => {
    expect(MD3DeckCard).toBeDefined();
    expect(typeof MD3DeckCard).toBe("object"); // forwardRef component
    expect(MD3CardHeader).toBeDefined();
    expect(MD3CardHeadline).toBeDefined();
    expect(MD3CardSubhead).toBeDefined();
    expect(MD3CardContent).toBeDefined();
    expect(MD3CardActions).toBeDefined();
    expect(MD3CardMedia).toBeDefined();
  });
});
