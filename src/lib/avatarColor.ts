// Deterministic avatar color from a string — tuned for dark surfaces
// (translucent tinted background, bright saturated text), same look every render.
const PALETTE = [
  { bg: "rgba(124,108,255,0.18)", text: "#a996ff" }, // violet
  { bg: "rgba(0,230,168,0.18)",   text: "#4ce6bb" }, // green
  { bg: "rgba(255,184,77,0.18)",  text: "#ffcb7a" }, // amber
  { bg: "rgba(255,92,122,0.18)",  text: "#ff8fa8" }, // pink
  { bg: "rgba(56,189,248,0.18)",  text: "#7dd3fc" }, // cyan
  { bg: "rgba(251,146,60,0.18)",  text: "#fdba74" }, // orange
  { bg: "rgba(163,163,255,0.18)", text: "#c4c4ff" }, // periwinkle
];

export function avatarStyle(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}