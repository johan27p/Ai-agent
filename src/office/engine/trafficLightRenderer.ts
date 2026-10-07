import { trafficLightEngine } from './trafficLight.js';

export interface TrafficLightPole {
  x: number;
  y: number;
  facing: 'left' | 'right';
}

export const CITY_TRAFFIC_LIGHTS: TrafficLightPole[] = [
  // West intersection signal (facing east traffic)
  { x: 37 * 16, y: 27 * 16 - 8, facing: 'right' },
  // East intersection signal (facing west traffic)
  { x: 44 * 16, y: 27 * 16 - 8, facing: 'left' },
];

/**
 * Renders high-visibility pixel-art traffic lights with glowing red, yellow,
 * and green lamps and hood visors at city intersections.
 */
export function renderTrafficLight(
  ctx: CanvasRenderingContext2D,
  pole: TrafficLightPole,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const px = Math.round(offsetX + pole.x * zoom);
  const py = Math.round(offsetY + pole.y * zoom);

  const trafficState = trafficLightEngine.getState();
  const activeColor = trafficState.color;

  ctx.save();
  ctx.translate(px, py);

  // Concrete Base & Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(-2 * z, 14 * z, 12 * z, 4 * z);

  // Vertical Steel Mast / Pole
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, -22 * z, 3 * z, 36 * z);
  ctx.fillStyle = '#475569';
  ctx.fillRect(0.5 * z, -22 * z, 1 * z, 36 * z);

  // Horizontal Signal Mounting Arm
  const armDir = pole.facing === 'right' ? 1 : -1;
  ctx.fillStyle = '#334155';
  ctx.fillRect(armDir > 0 ? 3 * z : -8 * z, -20 * z, 8 * z, 2.5 * z);

  // Signal Housing Box (Dark charcoal / matte black)
  const boxX = armDir > 0 ? 7 * z : -15 * z;
  const boxY = -24 * z;
  const boxW = 8 * z;
  const boxH = 20 * z;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1 * z;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // 3 Lenses: RED (top), YELLOW (middle), GREEN (bottom)
  const lampRadius = 2.4 * z;
  const lampCenterX = boxX + boxW / 2;

  // 1. RED LAMP (🔴)
  const isRed = activeColor === 'RED';
  const redY = boxY + 4 * z;
  // Visor hood
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX + 1 * z, redY - 3 * z, boxW - 2 * z, 1.5 * z);
  // Lens
  ctx.fillStyle = isRed ? '#ef4444' : '#450a0a';
  ctx.beginPath();
  ctx.arc(lampCenterX, redY, lampRadius, 0, Math.PI * 2);
  ctx.fill();
  if (isRed) {
    // Red Light Glow Bloom
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.arc(lampCenterX, redY, 8 * z, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. YELLOW LAMP (🟡)
  const isYellow = activeColor === 'YELLOW';
  const yellowY = boxY + 10 * z;
  // Visor hood
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX + 1 * z, yellowY - 3 * z, boxW - 2 * z, 1.5 * z);
  // Lens
  ctx.fillStyle = isYellow ? '#eab308' : '#422006';
  ctx.beginPath();
  ctx.arc(lampCenterX, yellowY, lampRadius, 0, Math.PI * 2);
  ctx.fill();
  if (isYellow) {
    // Yellow Light Glow Bloom
    ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
    ctx.beginPath();
    ctx.arc(lampCenterX, yellowY, 8 * z, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. GREEN LAMP (🟢)
  const isGreen = activeColor === 'GREEN';
  const greenY = boxY + 16 * z;
  // Visor hood
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX + 1 * z, greenY - 3 * z, boxW - 2 * z, 1.5 * z);
  // Lens
  ctx.fillStyle = isGreen ? '#22c55e' : '#052e16';
  ctx.beginPath();
  ctx.arc(lampCenterX, greenY, lampRadius, 0, Math.PI * 2);
  ctx.fill();
  if (isGreen) {
    // Green Light Glow Bloom
    ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(lampCenterX, greenY, 8 * z, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
