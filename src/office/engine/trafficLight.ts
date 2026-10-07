export type TrafficLightColor = 'GREEN' | 'YELLOW' | 'RED';

export interface TrafficLightState {
  color: TrafficLightColor;
  timeRemainingSec: number;
  isManualOverride: boolean;
  intersectionX: number; // world x coord of intersection stop line
  intersectionY: number;
}

class TrafficLightEngine {
  private color: TrafficLightColor = 'GREEN';
  private timer = 10;
  private isManual = false;
  private listeners = new Set<(state: TrafficLightState) => void>();

  // Cycle durations in seconds
  private readonly GREEN_DURATION = 10;
  private readonly YELLOW_DURATION = 3;
  private readonly RED_DURATION = 8;

  // Primary intersection coordinates (Row 28, Col 39)
  readonly stopLineWest = 37 * 16;
  readonly stopLineEast = 43 * 16;
  readonly intersectionY = 28 * 16;

  getState(): TrafficLightState {
    return {
      color: this.color,
      timeRemainingSec: Math.ceil(this.timer),
      isManualOverride: this.isManual,
      intersectionX: 40 * 16,
      intersectionY: this.intersectionY,
    };
  }

  subscribe(listener: (state: TrafficLightState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    for (const l of this.listeners) {
      l(state);
    }
  }

  update(dt: number): void {
    if (this.isManual) return;

    this.timer -= dt;
    if (this.timer <= 0) {
      if (this.color === 'GREEN') {
        this.color = 'YELLOW';
        this.timer = this.YELLOW_DURATION;
      } else if (this.color === 'YELLOW') {
        this.color = 'RED';
        this.timer = this.RED_DURATION;
      } else {
        this.color = 'GREEN';
        this.timer = this.GREEN_DURATION;
      }
      this.notify();
    }
  }

  /** Allows clicking the traffic light to toggle state instantly */
  toggleColor(): void {
    if (this.color === 'GREEN') {
      this.color = 'RED';
      this.timer = this.RED_DURATION;
    } else {
      this.color = 'GREEN';
      this.timer = this.GREEN_DURATION;
    }
    this.notify();
  }

  setColor(c: TrafficLightColor): void {
    this.color = c;
    this.timer = c === 'GREEN' ? this.GREEN_DURATION : c === 'YELLOW' ? this.YELLOW_DURATION : this.RED_DURATION;
    this.notify();
  }
}

export const trafficLightEngine = new TrafficLightEngine();
