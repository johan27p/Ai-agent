import { useState } from 'react';

interface CityBottomBarProps {
  onCenterAtTile?: (col: number, row: number) => void;
  onOpenPurplePanel: (tab?: 'manager' | 'chat' | 'taskboard' | 'memory' | 'settings') => void;
  onOpenReportModal?: () => void;
  onOpenSettingsModal: () => void;
  onOpenServerModal: () => void;
  onTriggerMainHP: () => void;
  onTriggerMeeting: () => void;
}

/**
 * Completely overhauled Modern City Navigation Dock:
 * Includes instant focus for Meeting Room, Traffic Intersection, Coding Lab,
 * Server Center, Masjid, and instant triggers for Phone & Meeting actions!
 */
export function CityBottomBar({
  onCenterAtTile,
  onOpenPurplePanel,
  onOpenSettingsModal,
  onOpenServerModal,
  onTriggerMainHP,
  onTriggerMeeting,
}: CityBottomBarProps) {
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActiveNotice(msg);
    setTimeout(() => setActiveNotice(null), 2500);
  };

  const handlePhone = () => {
    onTriggerMainHP();
    showNotice('📱 Main HP Aktif!');
  };

  const handleMeeting = () => {
    onCenterAtTile?.(50, 40);
    onTriggerMeeting();
    showNotice('🤝 Meeting Dimulai!');
  };

  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 select-none pointer-events-auto">
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0b0d14]/92 border border-white/15 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.75)] backdrop-blur-md">
        
        {/* 🏢 AI HQ */}
        <button
          onClick={() => onCenterAtTile?.(20, 14)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
          title="Pusatkan kamera ke AI Headquarters"
        >
          <span>🏢</span>
          <span className="hidden md:inline font-medium">HQ</span>
        </button>

        {/* 💻 Coding Lab & Modern PCs */}
        <button
          onClick={() => onCenterAtTile?.(19, 41)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 hover:bg-blue-950/80 text-blue-300 hover:text-blue-200 border border-blue-500/25 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
          title="Pusatkan kamera ke Coding Lab (Workstation Ultrawide & Dual Monitor)"
        >
          <span>💻</span>
          <span className="hidden sm:inline font-medium">Coding Lab</span>
        </button>

        {/* 🤝 Ruang Meeting Modern & Monitor Meeting Besar */}
        <button
          onClick={handleMeeting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-indigo-100 border border-indigo-500/35 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          title="Buka & Fokus ke Ruang Meeting (Meja Konferensi & Monitor Meeting Besar)"
        >
          <span className="text-sm">🤝</span>
          <span>Ruang Meeting</span>
        </button>

        {/* 🚦 Jalan Raya & Lampu Lalu Lintas */}
        <button
          onClick={() => onCenterAtTile?.(40, 28)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 border border-emerald-500/35 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95"
          title="Pusatkan kamera ke Perempatan Jalan Raya & Lampu Lalu Lintas"
        >
          <span className="text-sm">🚦</span>
          <span>Lalu Lintas</span>
        </button>

        {/* 🖥️ AI Server Center */}
        <button
          onClick={() => onCenterAtTile?.(66, 56)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 hover:bg-cyan-950/80 text-cyan-300 hover:text-cyan-200 border border-cyan-500/25 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
          title="Pusatkan kamera ke AI Server Center & Rak Server"
        >
          <span>🖥️</span>
          <span className="hidden md:inline font-medium">Server</span>
        </button>

        {/* 🕌 Masjid AI City */}
        <button
          onClick={() => onCenterAtTile?.(60, 14)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 hover:bg-emerald-950/80 text-emerald-300 hover:text-emerald-200 border border-emerald-500/25 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
          title="Pusatkan kamera ke Masjid AI City"
        >
          <span>🕌</span>
          <span className="hidden md:inline font-medium">Masjid</span>
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

        {/* 📱 Interactive Main HP Action Button */}
        <button
          onClick={handlePhone}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white border border-sky-400/30 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
          title="Picu semua agen mengeluarkan smartphone & scrolling layar bercahaya"
        >
          <span className="text-sm">📱</span>
          <span>Main HP</span>
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

        {/* 🟣 AI Director HQ Panel */}
        <button
          onClick={() => onOpenPurplePanel('manager')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl text-xs shadow-[0_0_16px_rgba(147,51,234,0.45)] transition-all cursor-pointer active:scale-95"
          title="Buka Pusat Komando AI Director HQ"
        >
          <span className="text-xs">🟣</span>
          <span className="font-mono tracking-wide">AI Director</span>
        </button>

        {/* ⚙️ Pengaturan */}
        <button
          onClick={onOpenSettingsModal}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Buka Pengaturan"
        >
          <span className="text-sm">⚙️</span>
        </button>

      </div>

      {/* Floating Action Notice Toast */}
      {activeNotice && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-full shadow-[0_0_20px_#06b6d4] animate-bounce">
          {activeNotice}
        </div>
      )}
    </footer>
  );
}
