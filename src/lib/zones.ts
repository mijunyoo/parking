import type { ZoneName } from './types';

// Zone rectangles in 343-base coordinate system (matches FloorMap.tsx)
// Each entry: [x, y, w, h, name]
export const ZONES: Array<[number, number, number, number, ZoneName]> = [
  [60,  22,  124, 32,  'L'],
  [14,  60,  42,  220, 'A'],
  [70,  70,  56,  78,  'C'],
  [134, 70,  56,  78,  'F'],
  [192, 60,  56,  32,  'K'],
  [192, 96,  70,  64,  'G'],
  [268, 96,  36,  64,  'I'],
  [312, 60,  22,  130, 'J'],
  [70,  168, 56,  102, 'D'],
  [134, 178, 50,  92,  'E'],
  [192, 168, 137, 22,  'H'],
  [60,  296, 226, 30,  'B'],
  [192, 196, 137, 92,  '주차불가'],
];

// Map a (x, y) point in 343-base to a zone name
export function pointToZone(x: number, y: number): ZoneName {
  for (const [zx, zy, zw, zh, name] of ZONES) {
    if (x >= zx && x <= zx + zw && y >= zy && y <= zy + zh) {
      return name;
    }
  }
  // Fallback: nearest zone
  let bestZone: ZoneName = 'A';
  let bestDist = Infinity;
  for (const [zx, zy, zw, zh, name] of ZONES) {
    const cx = zx + zw / 2;
    const cy = zy + zh / 2;
    const d = (cx - x) ** 2 + (cy - y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      bestZone = name;
    }
  }
  return bestZone;
}

// Designated family spot (B5 F zone, lower-center)
export const DESIGNATED_SPOT = { x: 162, y: 134 };
