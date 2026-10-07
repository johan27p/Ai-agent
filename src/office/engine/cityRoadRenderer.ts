import { TILE_SIZE } from '../types.js';

/**
 * Draws realistic asphalt city roads (Jalan Raya),
 * white dashed center dividers, pedestrian zebra crossings, and traffic stop lines.
 */
export function renderCityRoads(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const s = TILE_SIZE * zoom;

  ctx.save();

  // 1. 🛣️ Central Boulevard (Rows 27..29, across cols 1..cols-2)
  const roadY = offsetY + 27 * s;
  const roadH = 3 * s;
  const roadW = (cols - 2) * s;
  const roadX = offsetX + 1 * s;

  // Dark Asphalt Pavement Base
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(roadX, roadY, roadW, roadH);

  // Road Curbs / Sidewalk Borders
  ctx.fillStyle = '#475569';
  ctx.fillRect(roadX, roadY - 1.5 * z, roadW, 2 * z); // North Curb
  ctx.fillRect(roadX, roadY + roadH - 0.5 * z, roadW, 2 * z); // South Curb

  // White Dashed Center Lane Dividers (Row 28 center)
  const centerLineY = roadY + 1.5 * s - 0.75 * z;
  ctx.fillStyle = '#f8fafc';
  for (let c = 2; c < cols - 2; c += 2) {
    // Skip dashed lines right in the middle of intersection (Cols 38..42)
    if (c >= 38 && c <= 42) continue;
    ctx.fillRect(offsetX + c * s + 2 * z, centerLineY, s - 4 * z, 1.5 * z);
  }

  // 2. 🚶 Pedestrian Zebra Crossings & Stop Lines at Intersection (Cols 37..43)
  // West Zebra Crossing (Col 37)
  const westCrossX = offsetX + 37 * s;
  for (let bar = 0; bar < 6; bar++) {
    const barY = roadY + bar * (roadH / 6) + 1.5 * z;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(westCrossX, barY, 8 * z, (roadH / 6) - 3 * z);
  }
  // West Stop Line (Col 36.5)
  ctx.fillStyle = '#ef4444'; // Red-tinted solid stop bar
  ctx.fillRect(westCrossX - 3 * z, roadY, 2.5 * z, roadH);

  // East Zebra Crossing (Col 43)
  const eastCrossX = offsetX + 43 * s;
  for (let bar = 0; bar < 6; bar++) {
    const barY = roadY + bar * (roadH / 6) + 1.5 * z;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(eastCrossX, barY, 8 * z, (roadH / 6) - 3 * z);
  }
  // East Stop Line (Col 44)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(eastCrossX + 9 * z, roadY, 2.5 * z, roadH);

  // 3. 🛣️ South Boulevard (Rows 53..54)
  const southRoadY = offsetY + 53 * s;
  const southRoadH = 2 * s;
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(roadX, southRoadY, roadW, southRoadH);
  ctx.fillStyle = '#475569';
  ctx.fillRect(roadX, southRoadY - 1.5 * z, roadW, 1.5 * z);
  ctx.fillRect(roadX, southRoadY + southRoadH, roadW, 1.5 * z);

  // South Center divider
  const southCenterY = southRoadY + 1 * s - 0.75 * z;
  ctx.fillStyle = '#f8fafc';
  for (let c = 2; c < cols - 2; c += 2) {
    ctx.fillRect(offsetX + c * s + 2 * z, southCenterY, s - 4 * z, 1.5 * z);
  }

  ctx.restore();
}
