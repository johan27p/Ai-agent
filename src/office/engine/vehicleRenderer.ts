import type { Vehicle } from './vehicles.js';

/**
 * Draws crisp, vibrant pixel-art cars (mobil), server maintenance vans,
 * motorcycles (motor), and delivery scooters with animated wheels, headlights,
 * exhaust puffs, and rider helmets.
 */
export function renderVehicle(
  ctx: CanvasRenderingContext2D,
  vehicle: Vehicle,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const vx = Math.round(offsetX + vehicle.x * zoom);
  const vy = Math.round(offsetY + vehicle.y * zoom);

  ctx.save();

  const isFacingLeft = Math.cos(vehicle.direction) < 0;
  const isMoving = vehicle.speed > 0;
  const time = Date.now() / 150;

  if (vehicle.type === 'CAR') {
    // ── Pixel Art Car (Mobil Sedan / Taxi) ───────────────────────────────────
    const carW = 28 * z;
    const carH = 14 * z;
    const carColor = vehicle.color || '#e11d48'; // Default ruby red
    const roofColor = vehicle.secondaryColor || '#1e293b';

    ctx.save();
    ctx.translate(vx, vy);
    if (isFacingLeft) {
      ctx.scale(-1, 1);
    }

    // Car shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(-carW / 2 + 2 * z, carH / 2 - 1 * z, carW - 4 * z, 3 * z);

    // Car Body / Chassis
    ctx.fillStyle = carColor;
    ctx.fillRect(-carW / 2, -carH / 2 + 4 * z, carW, 6 * z);

    // Roof & Cabin
    ctx.fillStyle = roofColor;
    ctx.fillRect(-carW / 2 + 6 * z, -carH / 2, 14 * z, 5 * z);

    // Windshield & Windows (Glass)
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-carW / 2 + 15 * z, -carH / 2 + 1 * z, 4 * z, 3 * z); // Front window
    ctx.fillRect(-carW / 2 + 7 * z, -carH / 2 + 1 * z, 6 * z, 3 * z);  // Side window

    // Front Bumper & Headlight
    ctx.fillStyle = '#fef08a'; // Glowing yellow headlight
    ctx.fillRect(carW / 2 - 1.5 * z, -carH / 2 + 5 * z, 2 * z, 2 * z);

    // Rear Taillight
    ctx.fillStyle = '#ef4444'; // Red brake light
    ctx.fillRect(-carW / 2 - 0.5 * z, -carH / 2 + 5 * z, 1.5 * z, 2 * z);

    // Wheels (Front & Rear)
    ctx.fillStyle = '#0f172a'; // Black tires
    ctx.fillRect(-carW / 2 + 4 * z, carH / 2 - 4 * z, 5 * z, 4 * z);
    ctx.fillRect(carW / 2 - 9 * z, carH / 2 - 4 * z, 5 * z, 4 * z);

    // Hubcaps (Silver with spin flicker)
    ctx.fillStyle = isMoving && (Math.floor(time) % 2 === 0) ? '#cbd5e1' : '#94a3b8';
    ctx.fillRect(-carW / 2 + 5.5 * z, carH / 2 - 2.5 * z, 2 * z, 2 * z);
    ctx.fillRect(carW / 2 - 7.5 * z, carH / 2 - 2.5 * z, 2 * z, 2 * z);

    // Headlight Light Beam Cone
    ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
    ctx.beginPath();
    ctx.moveTo(carW / 2, -carH / 2 + 6 * z);
    ctx.lineTo(carW / 2 + 22 * z, -carH / 2 + 1 * z);
    ctx.lineTo(carW / 2 + 22 * z, -carH / 2 + 13 * z);
    ctx.closePath();
    ctx.fill();

    // Animated exhaust puffs when moving
    if (isMoving) {
      const puffOffset = (time % 3) * 2 * z;
      ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
      ctx.fillRect(-carW / 2 - 3 * z - puffOffset, carH / 2 - 3 * z, 2 * z, 2 * z);
    }

    ctx.restore();
  } else if (vehicle.type === 'VAN') {
    // ── Pixel Art Server Maintenance Van (Mobil Van Teknisi) ─────────────────
    const vanW = 32 * z;
    const vanH = 17 * z;
    const vanColor = vehicle.color || '#f8fafc'; // Clean server white
    const stripeColor = vehicle.secondaryColor || '#0284c7'; // Blue telecom stripe

    ctx.save();
    ctx.translate(vx, vy);
    if (isFacingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.fillRect(-vanW / 2 + 2 * z, vanH / 2 - 1 * z, vanW - 4 * z, 3 * z);

    // Main Boxy Body
    ctx.fillStyle = vanColor;
    ctx.fillRect(-vanW / 2, -vanH / 2 + 2 * z, vanW, 11 * z);

    // Aerodynamic Cab Front
    ctx.fillRect(vanW / 2 - 6 * z, -vanH / 2 + 5 * z, 6 * z, 8 * z);

    // Server Tech Stripe
    ctx.fillStyle = stripeColor;
    ctx.fillRect(-vanW / 2, -vanH / 2 + 8 * z, vanW, 2.5 * z);

    // Windshield & Front Glass
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(vanW / 2 - 7 * z, -vanH / 2 + 3 * z, 5 * z, 4 * z);

    // Roof Server Rack / Antenna
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-vanW / 2 + 6 * z, -vanH / 2, 14 * z, 2 * z);
    // Amber Beacon Light
    ctx.fillStyle = isMoving && (Math.floor(time) % 2 === 0) ? '#f59e0b' : '#d97706';
    ctx.fillRect(-vanW / 2 + 12 * z, -vanH / 2 - 1.5 * z, 2 * z, 1.8 * z);

    // Headlight & Taillight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(vanW / 2 - 1 * z, -vanH / 2 + 9 * z, 2 * z, 2 * z);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-vanW / 2 - 0.5 * z, -vanH / 2 + 9 * z, 1.5 * z, 2 * z);

    // Heavy duty tires
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-vanW / 2 + 5 * z, vanH / 2 - 4 * z, 5.5 * z, 4.5 * z);
    ctx.fillRect(vanW / 2 - 10 * z, vanH / 2 - 4 * z, 5.5 * z, 4.5 * z);

    ctx.restore();
  } else if (vehicle.type === 'SCOOTER') {
    // ── Pixel Art Scooter with Delivery Box (Motor Matic / Kurir) ────────────
    const motoW = 20 * z;
    const motoH = 16 * z;
    const scooterColor = vehicle.color || '#eab308'; // Bright yellow

    ctx.save();
    ctx.translate(vx, vy);
    if (isFacingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.fillRect(-motoW / 2 + 2 * z, motoH / 2 - 2 * z, motoW - 4 * z, 2 * z);

    // Small Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-motoW / 2 + 2 * z, motoH / 2 - 4 * z, 3.5 * z, 3.5 * z);
    ctx.fillRect(motoW / 2 - 5 * z, motoH / 2 - 4 * z, 3.5 * z, 3.5 * z);

    // Scooter step-through chassis & front fairing
    ctx.fillStyle = scooterColor;
    ctx.fillRect(-motoW / 2 + 4 * z, motoH / 2 - 6 * z, 9 * z, 3 * z);
    ctx.fillRect(motoW / 2 - 6 * z, motoH / 2 - 10 * z, 3.5 * z, 6 * z);

    // Rear Delivery Box (Kotak Paket)
    ctx.fillStyle = '#0284c7'; // Blue delivery box
    ctx.fillRect(-motoW / 2 + 1 * z, motoH / 2 - 12 * z, 6 * z, 6 * z);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-motoW / 2 + 2.5 * z, motoH / 2 - 10 * z, 3 * z, 2 * z);

    // Rider Body & Helmet
    ctx.fillStyle = '#334155';
    ctx.fillRect(-motoW / 2 + 7 * z, motoH / 2 - 12 * z, 4.5 * z, 6 * z);
    ctx.fillStyle = '#22c55e'; // Green Helmet
    ctx.fillRect(-motoW / 2 + 7.5 * z, motoH / 2 - 16 * z, 4.5 * z, 4.5 * z);
    ctx.fillStyle = '#0f172a'; // Visor
    ctx.fillRect(motoW / 2 - 7 * z, motoH / 2 - 14.5 * z, 2 * z, 1.8 * z);

    // Headlight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(motoW / 2 - 3 * z, motoH / 2 - 10 * z, 2 * z, 2 * z);

    ctx.restore();
  } else {
    // ── Pixel Art Motorcycle with Rider (Motor Sport) ────────────────────────
    const motoW = 19 * z;
    const motoH = 16 * z;
    const motoColor = vehicle.color || '#0284c7'; // Blue cyan

    ctx.save();
    ctx.translate(vx, vy);
    if (isFacingLeft) {
      ctx.scale(-1, 1);
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(-motoW / 2 + 2 * z, motoH / 2 - 2 * z, motoW - 4 * z, 2 * z);

    // Front & Rear Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-motoW / 2 + 1 * z, motoH / 2 - 4 * z, 4 * z, 4 * z);
    ctx.fillRect(motoW / 2 - 5 * z, motoH / 2 - 4 * z, 4 * z, 4 * z);

    // Silver Spokes
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-motoW / 2 + 2 * z, motoH / 2 - 3 * z, 2 * z, 2 * z);
    ctx.fillRect(motoW / 2 - 4 * z, motoH / 2 - 3 * z, 2 * z, 2 * z);

    // Motor Frame & Fuel Tank
    ctx.fillStyle = motoColor;
    ctx.fillRect(-motoW / 2 + 4 * z, motoH / 2 - 7 * z, 9 * z, 3 * z);

    // Exhaust Pipe
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-motoW / 2 + 1 * z, motoH / 2 - 4.5 * z, 6 * z, 1.5 * z);

    // Headlight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(motoW / 2 - 2 * z, motoH / 2 - 9 * z, 2 * z, 2 * z);

    // Headlight Light Beam Cone
    ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
    ctx.beginPath();
    ctx.moveTo(motoW / 2, motoH / 2 - 8 * z);
    ctx.lineTo(motoW / 2 + 16 * z, motoH / 2 - 13 * z);
    ctx.lineTo(motoW / 2 + 16 * z, motoH / 2 - 3 * z);
    ctx.closePath();
    ctx.fill();

    // Rider Body & Helmet
    ctx.fillStyle = '#1e3a8a'; // Rider jacket
    ctx.fillRect(-motoW / 2 + 4 * z, motoH / 2 - 12 * z, 5 * z, 5 * z);

    ctx.fillStyle = '#f97316'; // Orange Helmet
    ctx.fillRect(-motoW / 2 + 4.5 * z, motoH / 2 - 16 * z, 5 * z, 4.5 * z);
    // Helmet Visor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(motoW / 2 - 7.5 * z, motoH / 2 - 14 * z, 2.5 * z, 2 * z);

    // Animated exhaust puffs when moving
    if (isMoving) {
      const puffOffset = (time % 3) * 1.5 * z;
      ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.fillRect(-motoW / 2 - 2 * z - puffOffset, motoH / 2 - 5 * z, 1.8 * z, 1.8 * z);
    }

    ctx.restore();
  }

  ctx.restore();
}
