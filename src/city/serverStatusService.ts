import { hqStore } from '../hq/hqStore.js';

export type ServerConnectionStatus = 'online' | 'offline' | 'reconnecting';

export interface ServerStatusState {
  status: ServerConnectionStatus;
  latencyMs: number;
  lastChecked: number;
  offlineSince: number | null;
  serverLoad: number; // 0 - 100% CPU
  memoryUsageMb: number;
  totalMemoryMb: number;
  activeConnections: number;
  packetCount: number;
  deviceName: string;
  customEndpoint: string;
  isSimulatedOffline: boolean;
  historyLatency: number[];
}

class ServerStatusService {
  private state: ServerStatusState = {
    status: typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
    latencyMs: 14,
    lastChecked: Date.now(),
    offlineSince: null,
    serverLoad: 24,
    memoryUsageMb: 512,
    totalMemoryMb: 2048,
    activeConnections: 12,
    packetCount: 1480,
    deviceName: 'AI Server Node #1 (Local Host)',
    customEndpoint: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    isSimulatedOffline: false,
    historyLatency: [12, 14, 16, 13, 15, 14],
  };

  private listeners = new Set<(state: ServerStatusState) => void>();
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));

      // Periodically probe server connection every 3 seconds
      this.checkInterval = setInterval(() => this.probeServer(), 3000);
      setTimeout(() => this.probeServer(), 400);
    }
  }

  getState(): ServerStatusState {
    return this.state;
  }

  subscribe(listener: (state: ServerStatusState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private handleNetworkChange(isOnline: boolean) {
    if (this.state.isSimulatedOffline) return;
    if (isOnline) {
      this.probeServer();
    } else {
      this.setOffline();
    }
  }

  setDeviceName(name: string) {
    this.state = {
      ...this.state,
      deviceName: name,
    };
    this.notify();
  }

  setCustomEndpoint(endpoint: string) {
    this.state = {
      ...this.state,
      customEndpoint: endpoint,
    };
    this.notify();
    this.probeServer();
  }

  setSimulatedOffline(simulateOffline: boolean) {
    this.state = {
      ...this.state,
      isSimulatedOffline: simulateOffline,
    };

    if (simulateOffline) {
      this.setOffline();
    } else {
      this.probeServer();
    }
  }

  toggleSimulatedStatus() {
    this.setSimulatedOffline(!this.state.isSimulatedOffline);
  }

  async probeServer(): Promise<boolean> {
    if (this.state.isSimulatedOffline) {
      this.setOffline();
      return false;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setOffline();
      return false;
    }

    const start = performance.now();
    try {
      const url = this.state.customEndpoint || '/';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      }).catch(() => {
        // Fallback GET if HEAD rejected
        return fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - start);

      if (response && (response.ok || response.status < 400 || response.type === 'opaque')) {
        const wasOffline = this.state.status === 'offline';
        const updatedHistory = [...this.state.historyLatency.slice(-9), Math.max(1, latency)];

        this.state = {
          ...this.state,
          status: 'online',
          latencyMs: Math.max(1, latency),
          lastChecked: Date.now(),
          offlineSince: null,
          serverLoad: Math.floor(18 + Math.random() * 15),
          memoryUsageMb: Math.floor(480 + Math.random() * 60),
          activeConnections: 12 + Math.floor(Math.random() * 6),
          packetCount: this.state.packetCount + Math.floor(8 + Math.random() * 16),
          historyLatency: updatedHistory,
        };
        this.notify();

        if (wasOffline) {
          try {
            hqStore.sendMessage(
              'operations',
              `Farhan (DevOps): "🟢 Server [${this.state.deviceName}] kembali TERHUBUNG (Online)! Latency: ${latency}ms. Sistem aktif."`,
              'security',
              7,
            );
          } catch {}
        }
        return true;
      } else {
        this.setOffline();
        return false;
      }
    } catch {
      this.setOffline();
      return false;
    }
  }

  private setOffline() {
    const wasOnline = this.state.status === 'online';
    this.state = {
      ...this.state,
      status: 'offline',
      latencyMs: 0,
      lastChecked: Date.now(),
      offlineSince: this.state.offlineSince || Date.now(),
      serverLoad: 0,
      activeConnections: 0,
    };
    this.notify();

    if (wasOnline) {
      try {
        hqStore.sendMessage(
          'operations',
          `Farhan (DevOps): "⚠️ PERINGATAN: Koneksi server [${this.state.deviceName}] TERPUTUS (Offline)! Memeriksa device dan jalur koneksi."`,
          'security',
          7,
        );
      } catch {}
    }
  }
}

export const serverStatusService = new ServerStatusService();
