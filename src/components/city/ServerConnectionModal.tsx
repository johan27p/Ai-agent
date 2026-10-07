import React, { useState, useEffect } from 'react';
import { serverStatusService, type ServerStatusState } from '../../city/serverStatusService.js';

interface ServerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServerConnectionModal({ isOpen, onClose }: ServerConnectionModalProps) {
  const [serverState, setServerState] = useState<ServerStatusState>(serverStatusService.getState());
  const [endpointInput, setEndpointInput] = useState(serverState.customEndpoint);
  const [deviceInput, setDeviceInput] = useState(serverState.deviceName);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResultMsg, setPingResultMsg] = useState<string | null>(null);

  useEffect(() => {
    return serverStatusService.subscribe((state) => {
      setServerState(state);
      setEndpointInput(state.customEndpoint);
      setDeviceInput(state.deviceName);
    });
  }, []);

  if (!isOpen) return null;

  const isOnline = serverState.status === 'online';

  const handlePing = async () => {
    setIsPinging(true);
    setPingResultMsg(null);
    const success = await serverStatusService.probeServer();
    setIsPinging(false);
    if (success) {
      setPingResultMsg(`✅ Berhasil terhubung! Latency: ${serverStatusService.getState().latencyMs} ms`);
    } else {
      setPingResultMsg(`❌ Gagal terhubung ke endpoint server.`);
    }
    setTimeout(() => setPingResultMsg(null), 4000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    serverStatusService.setDeviceName(deviceInput);
    serverStatusService.setCustomEndpoint(endpointInput);
    handlePing();
  };

  const handleToggleSimulation = () => {
    serverStatusService.toggleSimulatedStatus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0f111a] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-900 via-[#151928] to-slate-900">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'} animate-pulse`} />
            <h2 className="text-base font-bold tracking-wide text-white flex items-center gap-2">
              <span>🖥️</span> Status & Koneksi Server Perangkat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-3 flex items-center justify-between ${isOnline ? 'bg-emerald-950/40 border-b border-emerald-500/20' : 'bg-rose-950/40 border-b border-rose-500/20'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{isOnline ? '🟢' : '🔴'}</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Jaringan</div>
              <div className={`text-sm font-bold ${isOnline ? 'text-emerald-300' : 'text-rose-300'}`}>
                {isOnline ? 'TERHUBUNG (ONLINE)' : 'TERPUTUS (OFFLINE)'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Latency / Ping</div>
            <div className="text-sm font-mono font-bold text-cyan-300">
              {isOnline ? `${serverState.latencyMs} ms` : 'Tidak Terjangkau'}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Hardware & Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/80 border border-white/5 rounded-xl text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Perangkat / Device</div>
              <div className="text-xs font-bold text-white truncate" title={serverState.deviceName}>
                {serverState.deviceName}
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-white/5 rounded-xl text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Load CPU Server</div>
              <div className="text-xs font-bold text-emerald-400">
                {isOnline ? `${serverState.serverLoad}%` : '0%'}
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-white/5 rounded-xl text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">RAM Terpakai</div>
              <div className="text-xs font-bold text-cyan-400">
                {isOnline ? `${serverState.memoryUsageMb} MB` : '0 MB'}
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-white/5 rounded-xl text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Paket Data</div>
              <div className="text-xs font-bold text-amber-300">
                {serverState.packetCount.toLocaleString()} Pkts
              </div>
            </div>
          </div>

          {/* Form Settings */}
          <form onSubmit={handleSaveConfig} className="p-4 bg-slate-900/60 border border-white/10 rounded-xl space-y-3">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <span>⚙️</span> Konfigurasi Alamat & Perangkat Server
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Nama Perangkat / Server:</label>
              <input
                type="text"
                value={deviceInput}
                onChange={(e) => setDeviceInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="Contoh: AI Cloud Server #1, PC Local, Raspberry Pi"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Target Endpoint / Host URL:</label>
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                placeholder="http://localhost:3000 atau IP alat"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                💾 Terapkan Konfigurasi
              </button>

              <button
                type="button"
                onClick={handlePing}
                disabled={isPinging}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 border border-white/10"
              >
                <span>⚡</span>
                <span>{isPinging ? 'Menguji...' : 'Tes Ping Sekarang'}</span>
              </button>
            </div>

            {pingResultMsg && (
              <div className="text-xs font-medium text-cyan-300 pt-1">
                {pingResultMsg}
              </div>
            )}
          </form>

          {/* Simulation Toggle & City Sync Note */}
          <div className="p-3.5 bg-purple-950/30 border border-purple-500/20 rounded-xl flex items-center justify-between">
            <div className="pr-4">
              <div className="text-xs font-bold text-purple-300">Simulasi Status Offline / Terputus</div>
              <div className="text-[11px] text-slate-400">
                Gunakan tombol ini untuk mengetes reaksi gedung AI Server Center dan agen saat server tiba-tiba offline atau online.
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleSimulation}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                serverState.isSimulatedOffline
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/15'
              }`}
            >
              {serverState.isSimulatedOffline ? '🔴 Mode Offline Aktif' : '🟢 Normal (Online)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <div>Terhubung otomatis dengan sensor jaringan browser & AI City Server Center</div>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-white/10 hover:bg-white/15 text-slate-200 rounded-md transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
