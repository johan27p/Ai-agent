import { useState, useEffect } from 'react';
import { serverStatusService, type ServerStatusState } from '../../city/serverStatusService.js';
import { trafficLightEngine, type TrafficLightState } from '../../office/engine/trafficLight.js';
import { calculatePrayerTimes } from '../../city/prayerSchedule.js';

interface CityTopHeaderProps {
  onOpenServerModal: () => void;
  onCenterAtTile?: (col: number, row: number) => void;
}

export function CityTopHeader({ onOpenServerModal, onCenterAtTile }: CityTopHeaderProps) {
  const [serverState, setServerState] = useState<ServerStatusState>(serverStatusService.getState());
  const [trafficState, setTrafficState] = useState<TrafficLightState>(trafficLightEngine.getState());
  const [currentTime, setCurrentTime] = useState('');
  const [nextPrayer, setNextPrayer] = useState(calculatePrayerTimes().nextPrayer);

  useEffect(() => {
    const unsubServer = serverStatusService.subscribe(setServerState);
    const unsubTraffic = trafficLightEngine.subscribe(setTrafficState);

    const updateClock = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
      );
      setNextPrayer(calculatePrayerTimes(d).nextPrayer);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      unsubServer();
      unsubTraffic();
      clearInterval(interval);
    };
  }, []);

  const isOnline = serverState.status === 'online';

  const trafficColorBadge =
    trafficState.color === 'GREEN'
      ? { text: '🟢 HIJAU', bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' }
      : trafficState.color === 'YELLOW'
      ? { text: '🟡 KUNING', bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300' }
      : { text: '🔴 MERAH', bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300' };

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none pointer-events-auto">
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0b0d14]/90 border border-white/15 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md text-xs">
        
        {/* City Title */}
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-white pr-1">
          <span className="text-sm">🏙️</span>
          <span className="font-mono text-[11px] uppercase text-cyan-400">AI CITY</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* Real-time Clock */}
        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
          <span>🕐</span>
          <span>{currentTime || '12:00 WIB'}</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* 🚦 Traffic Light Controller Widget */}
        <button
          onClick={() => {
            trafficLightEngine.toggleColor();
            onCenterAtTile?.(40, 28);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-sm ${trafficColorBadge.bg}`}
          title="Klik untuk mengubah status lampu lalu lintas merah/hijau & arahkan kamera"
        >
          <span>🚦</span>
          <span>{trafficColorBadge.text}</span>
          <span className="font-mono text-[10px] opacity-80">({String(trafficState.timeRemainingSec).padStart(2, '0')}s)</span>
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        {/* 🖥️ Live Server Badge */}
        <button
          onClick={onOpenServerModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium transition-all cursor-pointer active:scale-95 ${
            isOnline
              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-rose-950/50 border-rose-500/30 text-rose-300 hover:bg-rose-900/60'
          }`}
          title="Status Perangkat Server"
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-semibold">{isOnline ? `${serverState.latencyMs}ms` : 'Offline'}</span>
        </button>

        {/* 🕌 Adzan Next Prayer */}
        {nextPrayer && (
          <>
            <div className="w-[1px] h-4 bg-white/10" />
            <button
              onClick={() => onCenterAtTile?.(60, 14)}
              className="hidden md:flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
              title="Pusatkan kamera ke Masjid AI City"
            >
              <span>🕌</span>
              <span className="font-medium">{nextPrayer.name}:</span>
              <span className="font-mono">{nextPrayer.time}</span>
            </button>
          </>
        )}

      </div>
    </header>
  );
}
