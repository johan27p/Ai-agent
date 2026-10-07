import { serverStatusService } from '../../city/serverStatusService.js';

export interface ServerRackPos {
  col: number;
  row: number;
}

export const CITY_SERVER_RACKS: ServerRackPos[] = [
  { col: 58, row: 56 },
  { col: 62, row: 56 },
  { col: 68, row: 56 },
  { col: 72, row: 56 },
];

/**
 * Draws animated pixel-art server racks and wall monitoring terminal
 * in the AI Server Center, dynamically synced to real server connection status!
 */
export function renderServerRacks(
  ctx: CanvasRenderingContext2D,
  rack: ServerRackPos,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const rx = Math.round(offsetX + (rack.col * 16) * zoom);
  const ry = Math.round(offsetY + (rack.row * 16) * zoom);

  const serverState = serverStatusService.getState();
  const isOnline = serverState.status === 'online';
  const time = Date.now() / 120;

  ctx.save();
  ctx.translate(rx, ry);

  // Soft shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(-2 * z, 14 * z, 18 * z, 4 * z);

  // Server Rack Metal Frame / Cabinet (14x30 pixels)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, -12 * z, 14 * z, 26 * z);

  // Metal outer casing & bevel
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(1 * z, -11 * z, 12 * z, 24 * z);

  // 4 Server Blade Units (Racks)
  for (let unit = 0; unit < 4; unit++) {
    const uy = -10 * z + unit * 6 * z;

    // Blade chassis
    ctx.fillStyle = '#334155';
    ctx.fillRect(2 * z, uy, 10 * z, 5 * z);

    // Front vent grille
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(2.5 * z, uy + 1 * z, 5 * z, 3 * z);

    // Dynamic LED Status Lights synced to real connection!
    if (isOnline) {
      // 🟢 ONLINE: Active green/cyan traffic packet blinks
      const blink1 = (Math.floor(time + unit * 2 + rack.col) % 3 === 0);
      const blink2 = (Math.floor(time * 1.5 + unit) % 2 === 0);

      ctx.fillStyle = blink1 ? '#22c55e' : '#14532d'; // Activity LED
      ctx.fillRect(8.5 * z, uy + 1.2 * z, 1.2 * z, 1.2 * z);

      ctx.fillStyle = blink2 ? '#38bdf8' : '#0369a1'; // Data Link LED
      ctx.fillRect(10 * z, uy + 1.2 * z, 1.2 * z, 1.2 * z);

      // Power Green LED (always solid)
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(8.5 * z, uy + 3 * z, 1 * z, 1 * z);
    } else {
      // 🔴 OFFLINE: Emergency alarm red/amber strobe
      const alertPulse = (Math.floor(time * 0.8) % 2 === 0);

      ctx.fillStyle = alertPulse ? '#ef4444' : '#7f1d1d'; // Red Warning
      ctx.fillRect(8.5 * z, uy + 1.2 * z, 1.4 * z, 1.4 * z);

      ctx.fillStyle = alertPulse ? '#f59e0b' : '#78350f'; // Amber Fault
      ctx.fillRect(10 * z, uy + 1.2 * z, 1.4 * z, 1.4 * z);

      // Power Red LED
      ctx.fillStyle = '#f87171';
      ctx.fillRect(8.5 * z, uy + 3 * z, 1 * z, 1 * z);
    }
  }

  // Subtle Status Glow Aura around Rack
  if (isOnline) {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
  } else {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  }
  ctx.beginPath();
  ctx.arc(7 * z, 2 * z, 10 * z, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
