import { useEffect, useState } from 'react';
import { calculatePrayerTimes, formatTime24, getTimeOfDayPeriod } from '../../city/prayerSchedule.js';
import { adzanEventService } from '../../city/adzanService.js';
import { serverStatusService, type ServerStatusState } from '../../city/serverStatusService.js';

interface HQStatusBarProps {
  onOpenHQModal?: () => void;
}

export function HQStatusBar({ onOpenHQModal }: HQStatusBarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [serverState, setServerState] = useState<ServerStatusState>(serverStatusService.getState());

  // Automatic live clock ticking every second from device / server time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    const unsub = serverStatusService.subscribe((s) => setServerState(s));
    return () => {
      clearInterval(timer);
      unsub();
    };
  }, []);

  const timePeriod = getTimeOfDayPeriod(currentDate);
  const prayerSchedule = calculatePrayerTimes(currentDate);
  const timeFormatted = formatTime24(currentDate);

  const isServerOnline = serverState.status === 'online';

  return (
    <header className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between bg-[#0e0e18]/90 text-white px-3.5 py-1.5 border border-[#2b2b40] shadow-pixel backdrop-blur-md select-none text-xs pointer-events-auto">
      {/* Brand & Automatic World Clock & Server Connection Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-accent-bright">
          <span className="text-sm">🏢</span>
          <span className="text-xs uppercase font-mono">AI HQ CITY</span>
        </div>

        {/* Live Device / Server Connection Status Badge */}
        <button
          onClick={() => serverStatusService.toggleSimulatedStatus()}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-3xs font-mono font-bold transition-all cursor-pointer ${
            isServerOnline
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              : 'bg-red-950/90 text-red-300 border border-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          }`}
          title="Status Koneksi Server Perangkat (Klik untuk test switch online/offline)"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isServerOnline ? 'bg-emerald-400' : 'bg-red-500'}`} />
          <span>{isServerOnline ? `ONLINE · ${serverState.latencyMs}ms` : 'OFFLINE · TERPUTUS'}</span>
        </button>

        <span className="text-[#3b3b55] hidden sm:inline" aria-hidden="true">
          ·
        </span>

        {/* Automatic Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-2xs text-white/90">
          <span className="text-xs text-yellow-300">🕐</span>
          <span className="font-bold tracking-widest">{timeFormatted}</span>
        </div>

        <span className="text-[#3b3b55] hidden md:inline" aria-hidden="true">
          ·
        </span>

        {/* Real-time Day/Night Period */}
        <div className="hidden md:flex items-center gap-1 text-2xs">
          <span>{timePeriod.icon}</span>
          <span className="font-medium text-white/80">{timePeriod.label}</span>
        </div>
      </div>

      {/* Real-Time Prayer Schedule Indicator & Adzan Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 text-2xs bg-[#161626] px-2.5 py-0.5 border border-[#2e2e46]">
          <span className="text-emerald-400">🕌 Salat Berikutnya:</span>
          <span className="font-bold text-white font-mono">{prayerSchedule.nextPrayer.name}</span>
          <span className="text-text-muted font-mono">({prayerSchedule.nextPrayer.time})</span>
          <span className="text-3xs text-emerald-400 font-mono">
            [-{prayerSchedule.nextPrayer.minutesLeft}m]
          </span>
        </div>

        <button
          onClick={() => adzanEventService.triggerAdzanEvent(prayerSchedule.nextPrayer.name)}
          className="flex items-center gap-1 bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/70 px-2.5 py-0.5 text-2xs cursor-pointer active:translate-y-0.5 font-semibold transition-all shadow-sm"
          title="Kumandangkan Adzan & Jalankan Sholat Berjamaah"
        >
          <span>🔊</span>
          <span className="hidden sm:inline">Kumandangkan Adzan</span>
          <span className="sm:hidden">Adzan</span>
        </button>

        {onOpenHQModal && (
          <button
            onClick={onOpenHQModal}
            className="flex items-center gap-1 bg-[#1e1e32] hover:bg-accent text-white px-2 py-0.5 border border-[#35354e] text-2xs cursor-pointer transition-colors active:translate-y-0.5 font-semibold"
            title="Buka Menu HQ"
          >
            <span>👑</span>
            <span className="hidden md:inline">HQ Menu</span>
          </button>
        )}
      </div>
    </header>
  );
}
