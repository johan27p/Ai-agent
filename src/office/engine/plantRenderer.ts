export interface CityTree {
  x: number;
  y: number;
  type: 'palm' | 'shade' | 'flower' | 'planter';
}

export const CITY_TREES: CityTree[] = [
  // 🕌 Masjid Courtyard Date Palms (Pohon Palem Kurma Masjid)
  { x: 45 * 16, y: 24 * 16, type: 'palm' },
  { x: 74 * 16, y: 24 * 16, type: 'palm' },
  { x: 44 * 16, y: 5 * 16, type: 'palm' },
  { x: 75 * 16, y: 5 * 16, type: 'palm' },
  { x: 52 * 16, y: 25 * 16, type: 'palm' },
  { x: 67 * 16, y: 25 * 16, type: 'palm' },

  // 🌳 City Park (Taman Kota - Rindang & Bunga Mekar)
  { x: 30 * 16, y: 56 * 16, type: 'shade' },
  { x: 36 * 16, y: 57 * 16, type: 'flower' },
  { x: 42 * 16, y: 56 * 16, type: 'shade' },
  { x: 48 * 16, y: 57 * 16, type: 'flower' },
  { x: 51 * 16, y: 56 * 16, type: 'shade' },

  // 🏙️ Central Boulevard Trees & Sidewalk Planters
  { x: 8 * 16, y: 28 * 16, type: 'shade' },
  { x: 22 * 16, y: 28 * 16, type: 'planter' },
  { x: 36 * 16, y: 28 * 16, type: 'flower' },
  { x: 40 * 16, y: 28 * 16, type: 'planter' },
  { x: 64 * 16, y: 28 * 16, type: 'palm' },
  { x: 76 * 16, y: 28 * 16, type: 'planter' },

  // 🚗 South Boulevard Greenery
  { x: 12 * 16, y: 53 * 16, type: 'shade' },
  { x: 26 * 16, y: 53 * 16, type: 'flower' },
  { x: 54 * 16, y: 53 * 16, type: 'shade' },
  { x: 68 * 16, y: 53 * 16, type: 'planter' },
];

/**
 * Draws animated lush trees & plants with subtle wind sway.
 */
export function renderCityTree(
  ctx: CanvasRenderingContext2D,
  tree: CityTree,
  offsetX: number,
  offsetY: number,
  zoom: number,
  time = Date.now() / 1000,
): void {
  const z = Math.max(1, zoom);
  const tx = Math.round(offsetX + tree.x * zoom);
  const ty = Math.round(offsetY + tree.y * zoom);

  ctx.save();
  ctx.translate(tx, ty);

  // Soft tree shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(0, 4 * z, 12 * z, 6 * z, 0, 0, Math.PI * 2);
  ctx.fill();

  const sway = Math.sin(time * 2 + tree.x * 0.1) * 0.045;

  if (tree.type === 'palm') {
    // ── Palm Tree (Pohon Palem Kurma Masjid) ─────────────────────────────────
    // Curved trunk with bark rings
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2 * z, -18 * z, 4 * z, 20 * z);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-1.5 * z, -18 * z, 1.5 * z, 20 * z);

    // Palm fronds swaying
    ctx.save();
    ctx.rotate(sway);
    ctx.fillStyle = '#15803d'; // Emerald green
    ctx.beginPath();
    ctx.arc(0, -22 * z, 14 * z, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(-8 * z, -20 * z, 8 * z, 0, Math.PI * 2);
    ctx.arc(8 * z, -20 * z, 8 * z, 0, Math.PI * 2);
    ctx.fill();

    // Date fruits
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-2 * z, -18 * z, 2 * z, 2.5 * z);
    ctx.fillRect(1 * z, -18 * z, 2 * z, 2.5 * z);
    ctx.restore();
  } else if (tree.type === 'shade') {
    // ── Lush Shade Tree (Pohon Peneduh Kota) ─────────────────────────────────
    // Brown sturdy trunk
    ctx.fillStyle = '#5c2c16';
    ctx.fillRect(-3 * z, -14 * z, 6 * z, 16 * z);

    ctx.save();
    ctx.rotate(sway);
    // Deep foliage
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(0, -20 * z, 13 * z, 0, Math.PI * 2);
    ctx.fill();

    // Bright foliage layer
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-3 * z, -22 * z, 10 * z, 0, Math.PI * 2);
    ctx.arc(4 * z, -21 * z, 9 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (tree.type === 'planter') {
    // ── Sidewalk Planter Box (Pot Tanaman Trotoar) ────────────────────────────
    // Wooden / Concrete Box
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-5 * z, -3 * z, 10 * z, 6 * z);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-5 * z, -3 * z, 10 * z, 1.5 * z);

    // Green Foliage inside box
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-4 * z, -7 * z, 8 * z, 5 * z);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(-2 * z, -8 * z, 4 * z, 2 * z);
  } else {
    // ── Flower Bush (Tanaman Bunga Hias) ─────────────────────────────────────
    // Bush foliage
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, -6 * z, 8 * z, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(-2 * z, -7 * z, 6 * z, 0, Math.PI * 2);
    ctx.fill();

    // Blossoming flowers (Red, Yellow, Purple)
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-3 * z, -8 * z, 2.5 * z, 2.5 * z);
    ctx.fillRect(2 * z, -6 * z, 2.5 * z, 2.5 * z);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0 * z, -10 * z, 2 * z, 2 * z);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-4 * z, -5 * z, 2 * z, 2 * z);
  }

  ctx.restore();
}
