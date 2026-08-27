import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardLayer } from "deckfx";

const meta: Meta<typeof Card> = {
  title: "DeckFX/HolographicCard",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    holoStrength: {
      control: { type: "range", min: 0, max: 2, step: 0.05 },
      description:
        "Controls the strength/intensity multiplier of the holographic foil effect",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * 1. Simple Non-Holographic Card
 * Demonstrates that standard non-holographic cards remain effortless to write:
 * Just pass standard imageUrl or custom children with zero holo overhead.
 */
export const SimpleNonHolographicCard: Story = {
  args: {
    width: 240,
    height: 336,
    showGlare: true,
    shadow: "xl",
    maxTilt: 18,
    scaleOnHover: 1.05,
    children: (
      <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-900 text-white rounded-xl select-none border border-slate-700">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Common Unit
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            Lv. 3
          </span>
        </div>
        <div className="my-auto text-center">
          <div className="text-4xl mb-2">🛡️</div>
          <div className="font-bold text-lg text-slate-100">
            Castle Sentinel
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Standard non-foil card
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-2 font-mono">
          <span>ATK / 1200</span>
          <span>DEF / 2000</span>
        </div>
      </div>
    ),
  },
};

/**
 * 2. Full-Surface Holographic Foil
 * Simple card with full-surface holographic iridescent foil.
 */
export const FullSurfaceHolographic: Story = {
  args: {
    width: 240,
    height: 336,
    holographic: true,
    holoStrength: 0.65,
    shadow: "2xl",
    maxTilt: 20,
    scaleOnHover: 1.08,
    children: (
      <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl select-none">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Legendary Foil
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
            ★ 99
          </span>
        </div>
        <div className="my-auto text-center">
          <div className="text-4xl mb-2">✨</div>
          <div className="font-bold text-lg text-white">Stardust Dragon</div>
          <div className="text-xs text-slate-300 mt-1">
            Cosmic Holographic Secret Rare
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 border-t border-white/10 pt-2 font-mono">
          <span>ATK / 3000</span>
          <span>DEF / 2500</span>
        </div>
      </div>
    ),
  },
};

/**
 * 3. Multi-Layer Holographic Card (Arbitrary Layers, Selective Holo, 3D Parallax)
 * Layer 0: Cosmic Background (with subtle holo foil)
 * Layer 1: Character (Parallax depth 18, NO holo so character stays crisp!)
 * Layer 2: Prismatic Aura (Parallax depth 28, Holographic with cosmic variant)
 * Layer 3: Card UI / Text overlay
 */
export const MultiLayerSelectiveHolo: Story = {
  args: {
    width: 260,
    height: 364,
    shadow: "2xl",
    maxTilt: 22,
    scaleOnHover: 1.08,
    layers: [
      // Layer 0: Deep space background with subtle holo
      {
        id: "bg-space",
        parallax: -10,
        content: (
          <div className="w-full h-full bg-gradient-to-b from-indigo-950 via-slate-950 to-black" />
        ),
        holographic: {
          intensity: 0.8,
          variant: "cosmic",
          patternUrl: "https://assets.codepen.io/605876/figma-texture.png",
          patternOpacity: 0.25,
        },
      },
      // Layer 1: Floating Character Art (Parallax pop, NO holo = crisp character!)
      {
        id: "character-art",
        parallax: 20,
        content: (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="text-7xl filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                🐉
              </div>
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-xl -z-10" />
            </div>
          </div>
        ),
      },
      // Layer 2: Foreground Prismatic Ring / Aura (Extra parallax + luminous ring)
      {
        id: "magic-aura",
        parallax: 32,
        content: (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div
              className="w-32 h-32 rounded-full border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.5)] animate-spin"
              style={{ animationDuration: "20s" }}
            />
          </div>
        ),
      },
      // Layer 3: Card Frame & Text UI
      {
        id: "card-ui",
        parallax: 8,
        content: (
          <div className="w-full h-full flex flex-col justify-between p-4 text-white select-none pointer-events-none">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30 backdrop-blur-sm">
                Mythic Foil
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40 backdrop-blur-sm">
                ✦ 100
              </span>
            </div>
            <div className="mt-auto bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-white/10">
              <div className="font-bold text-base text-cyan-100 flex items-center justify-between">
                <span>Aetherwyrm Leviathan</span>
                <span className="text-xs text-cyan-400 font-mono">WATER</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Selective 3-layer holo: background shimmer, 3D character pop,
                and foreground prismatic aura.
              </p>
              <div className="flex justify-between text-xs text-cyan-300/80 border-t border-white/10 mt-2 pt-1.5 font-mono">
                <span>ATK / 4200</span>
                <span>DEF / 3800</span>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
};

/**
 * 4. Masked Holographic Foil (Only masked area reflects foil light)
 * Using maskUrl so only specific runes/crests reflect iridescent light.
 */
export const MaskedFoilCrest: Story = {
  args: {
    width: 240,
    height: 336,
    shadow: "2xl",
    maxTilt: 22,
    layers: [
      {
        id: "base-card",
        content: (
          <div className="w-full h-full bg-gradient-to-br from-stone-900 via-zinc-950 to-neutral-900 p-4 flex flex-col justify-between text-white select-none">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Gilded Seal
              </span>
              <span className="text-xs text-stone-400 font-mono">#001</span>
            </div>
            <div className="my-auto text-center">
              <div className="text-5xl mb-2">⚜️</div>
              <div className="font-bold text-lg text-amber-100">
                Imperial Seal
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Masked Golden Relic
              </div>
            </div>
            <div className="text-center text-[11px] text-amber-300/70 border-t border-stone-800 pt-2 font-mono">
              ★ Masked Foil Layer ★
            </div>
          </div>
        ),
      },
      {
        id: "gold-foil-crest",
        parallax: 15,
        holographic: {
          intensity: 1.5,
          variant: "gold",
          watermarkUrl: "https://assets.codepen.io/605876/shopify-pattern.svg",
          watermarkOpacity: 0.6,
        },
        maskUrl: "https://assets.codepen.io/605876/shopify-pattern.svg",
        maskSize: "65%",
        maskPosition: "center",
        maskRepeat: "no-repeat",
      },
    ],
  },
};

/**
 * 5. Declarative CardLayer Composition
 */
export const DeclarativeLayersStory: Story = {
  render: () => (
    <Card
      width={240}
      height={336}
      maxTilt={20}
      shadow="2xl"
      scaleOnHover={1.08}
    >
      {/* Background layer */}
      <CardLayer
        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
        holographic={{ variant: "cosmic", intensity: 1.2 }}
      />
      {/* 3D Floating Avatar */}
      <CardLayer parallax={25}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl filter drop-shadow-2xl">⚔️</div>
        </div>
      </CardLayer>
      {/* Foreground UI */}
      <CardLayer parallax={10}>
        <div className="w-full h-full flex flex-col justify-between p-4 text-white select-none">
          <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-300">
            Artifact Rare
          </span>
          <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
            <div className="font-bold text-sm text-fuchsia-200">
              Blade of Eternity
            </div>
            <div className="text-[10px] text-slate-300">
              Composite JSX &lt;CardLayer /&gt;
            </div>
          </div>
        </div>
      </CardLayer>
    </Card>
  ),
};

/**
 * 6. Comparison: Simple Non-Holo vs. Multi-Layer Holo
 */
export const SideBySideComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center justify-center p-8 bg-slate-950 rounded-2xl">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">
          Simple Non-Holo Card
        </span>
        <Card
          width={220}
          height={308}
          showGlare={true}
          shadow="xl"
          maxTilt={20}
        >
          <div className="w-full h-full p-4 bg-slate-800 text-white flex flex-col justify-between rounded-xl">
            <span className="text-xs font-bold text-slate-400">
              Standard Rare
            </span>
            <div className="text-center">
              <div className="text-3xl mb-1">🛡️</div>
              <div className="font-bold text-sm">Iron Guardian</div>
            </div>
            <span className="text-[10px] text-slate-500 text-right">
              Pure & Fast (No Holo)
            </span>
          </div>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-indigo-400">
          Multi-Layer Masked Foil
        </span>
        <Card
          width={220}
          height={308}
          shadow="2xl"
          maxTilt={20}
          layers={[
            {
              id: "bg",
              content: (
                <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />
              ),
              holographic: { variant: "rainbow", intensity: 1.3 },
            },
            {
              id: "art",
              parallax: 20,
              content: (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl filter drop-shadow-lg">⚡</div>
                </div>
              ),
            },
            {
              id: "ui",
              parallax: 10,
              content: (
                <div className="w-full h-full p-4 text-white flex flex-col justify-between select-none">
                  <span className="text-xs font-bold text-amber-400">
                    Holo Foil Rare
                  </span>
                  <div className="bg-black/40 backdrop-blur-sm p-2 rounded text-center">
                    <div className="font-bold text-sm text-indigo-100">
                      Prismatic Overlord
                    </div>
                    <span className="text-[10px] text-indigo-300">
                      Multi-Layer Depth
                    </span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  ),
};
