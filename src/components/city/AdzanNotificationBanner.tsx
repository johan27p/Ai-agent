import { useEffect, useState } from 'react';
import { adzanEventService, type AdzanState } from '../../city/adzanService.js';

export function AdzanNotificationBanner() {
  const [adzanState, setAdzanState] = useState<AdzanState>(adzanEventService.getState());

  useEffect(() => {
    return adzanEventService.subscribe((state) => {
      setAdzanState(state);
    });
  }, []);

  if (!adzanState.isActive) return null;

  const stepLabels: Record<AdzanState['step'], string> = {
    adzan: '1. Adzan Berkumandang',
    checkpoint: '2. Simpan Progres (Safe Checkpoint)',
    wudhu: '3. Menuju Masjid & Wudhu',
    salat: '4. Salat Berjamaah',
    doa: '5. Doa & Keberkahan',
    selesai: 'Selesai',
  };

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="bg-gradient-to-r from-[#062414] via-[#0b3d22] to-[#062414] border-2 border-emerald-400 text-white p-3 shadow-[0_0_25px_rgba(16,185,129,0.35)] select-none">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-emerald-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🕌</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-wider text-emerald-200 uppercase font-mono">
                  ADZAN BERKUMANDANG • SALAT {adzanState.prayerName.toUpperCase()}
                </span>
                <span className="text-[8px] bg-yellow-950/80 text-yellow-300 border border-yellow-500/50 px-1 py-0.2 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-[9px] text-emerald-300/80">
                Zona Waktu: {adzanState.timezone} • Agen menuju MASJID AI CITY
              </p>
            </div>
          </div>

          <button
            onClick={() => adzanEventService.finishEarly()}
            className="text-[9px] bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/60 px-2 py-1 cursor-pointer font-semibold transition-colors"
            title="Selesaikan Salat Lebih Cepat"
          >
            ✓ Selesai
          </button>
        </div>

        {/* Live Step Progress Indicator */}
        <div className="mt-2 flex items-center justify-between text-[10px]">
          <span className="font-bold text-yellow-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{stepLabels[adzanState.step]}</span>
          </span>
          <span className="text-[9px] text-emerald-300/80 font-mono">Status: 🕌 Sedang Salat</span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-[#03150b] mt-1.5 overflow-hidden border border-emerald-700/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-yellow-300 transition-all duration-700"
            style={{
              width:
                adzanState.step === 'adzan'
                  ? '20%'
                  : adzanState.step === 'checkpoint'
                  ? '40%'
                  : adzanState.step === 'wudhu'
                  ? '60%'
                  : adzanState.step === 'salat'
                  ? '80%'
                  : '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
