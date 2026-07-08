// Deterministic avatar color from a string — solid, vivid squares (like the
// reference site's colorful tool icons), white icon/initial on top.
const PALETTE = [
  { bg: "#5b4fd6", text: "#ffffff" }, // violet
  { bg: "#0f9d78", text: "#ffffff" }, // green
  { bg: "#e2711d", text: "#ffffff" }, // orange
  { bg: "#d6336c", text: "#ffffff" }, // pink
  { bg: "#0891b2", text: "#ffffff" }, // cyan
  { bg: "#c2410c", text: "#ffffff" }, // rust
  { bg: "#6d28d9", text: "#ffffff" }, // deep purple
  { bg: "#0369a1", text: "#ffffff" }, // blue
];

export function avatarStyle(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}