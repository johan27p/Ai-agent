import { trafficLightEngine } from './trafficLight.js';

export type VehicleType =
  | 'CAR'
  | 'MOTORCYCLE'
  | 'VAN'
  | 'SCOOTER'
  | 'BICYCLE'
  | 'SHUTTLE';

export interface Vehicle {
  id: string;
  type: VehicleType;

  x: number;
  y: number;

  targetX: number;
  targetY: number;

  speed: number;
  direction: number;
  active: boolean;
  driverId: number | null;

  color?: string;
  secondaryColor?: string;
  minX?: number;
  maxX?: number;
  model?: string;
  isStoppedAtLight?: boolean;
}

export function createVehicle(
  id: string,
  type: VehicleType,
  x: number,
  y: number,
  color?: string,
  minX = 64,
  maxX = 1200,
  secondaryColor?: string,
  model?: string,
): Vehicle {
  return {
    id,
    type,
    x,
    y,
    targetX: maxX,
    targetY: y,
    speed:
      type === 'CAR'
        ? 65
        : type === 'VAN'
        ? 55
        : type === 'MOTORCYCLE'
        ? 82
        : type === 'SCOOTER'
        ? 70
        : type === 'BICYCLE'
        ? 35
        : 50,
    direction: 0,
    active: true,
    driverId: null,
    color,
    secondaryColor,
    minX,
    maxX,
    model,
    isStoppedAtLight: false,
  };
}

export function updateVehicle(
  vehicle: Vehicle,
  dt: number,
): void {
  if (!vehicle.active || vehicle.speed === 0) {
    return;
  }

  const dx = vehicle.targetX - vehicle.x;
  const dy = vehicle.targetY - vehicle.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // If vehicle reached waypoint, turn around and travel back along boulevard
  if (distance < 12) {
    if (vehicle.minX !== undefined && vehicle.maxX !== undefined) {
      if (Math.abs(vehicle.x - vehicle.maxX) < 20) {
        vehicle.targetX = vehicle.minX;
      } else {
        vehicle.targetX = vehicle.maxX;
      }
    }
    return;
  }

  // 🚦 Traffic Light Collision / Stopping Logic
  const trafficState = trafficLightEngine.getState();
  const isRedOrYellow = trafficState.color === 'RED' || trafficState.color === 'YELLOW';
  const isBoulevard = Math.abs(vehicle.y - 448) < 40; // Central Boulevard (Row 28)

  if (isBoulevard && isRedOrYellow) {
    // Eastbound vehicle approaching west stop line (around x = 580)
    if (dx > 0 && vehicle.x >= 540 && vehicle.x <= 585) {
      vehicle.isStoppedAtLight = true;
      return;
    }
    // Westbound vehicle approaching east stop line (around x = 690)
    if (dx < 0 && vehicle.x <= 740 && vehicle.x >= 695) {
      vehicle.isStoppedAtLight = true;
      return;
    }
  }

  vehicle.isStoppedAtLight = false;

  const move = Math.min(distance, vehicle.speed * dt);

  vehicle.x += (dx / distance) * move;
  vehicle.y += (dy / distance) * move;

  vehicle.direction = Math.atan2(dy, dx);
}

export function setVehicleDestination(
  vehicle: Vehicle,
  x: number,
  y: number,
): void {
  vehicle.targetX = x;
  vehicle.targetY = y;
}
