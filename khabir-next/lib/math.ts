export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Smooth 0 to 1 ramp between two edges. */
export function smoothstep(value: number, edge0: number, edge1: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
