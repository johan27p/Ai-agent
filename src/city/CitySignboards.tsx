import { useEffect, useState } from 'react';
import { TILE_SIZE } from '../constants.js';
import type { OfficeState } from '../office/engine/officeState.js';
import { overlayProjection } from '../office/projection.js';
import { AI_CITY_BUILDINGS, type AICityBuilding } from './buildings.js';

interface CitySignboardsProps {
  officeState: OfficeState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  panRef: React.RefObject<{ x: number; y: number }>;
  onSelectBuilding?: (building: AICityBuilding) => void;
  onCenterAtTile?: (col: number, row: number) => void;
}

export function CitySignboards({
  officeState,
  containerRef,
  zoom,
  panRef,
  onSelectBuilding,
  onCenterAtTile,
}: CitySignboardsProps) {
  const [, setTick] = useState(0);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  // Smooth frame loop for responsive overlay coordinates during pan/zoom
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setTick((t) => (t + 1) % 10000);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const container = containerRef.current;
  if (!container) return null;

  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const layout = officeState.getLayout();
  const proj = overlayProjection(layout, rect, zoom, panRef.current ?? { x: 0, y: 0 }, dpr);

  const handleBuildingClick = (b: AICityBuilding) => {
    setSelectedBuildingId(b.id === selectedBuildingId ? null : b.id);
    if (onCenterAtTile) {
      onCenterAtTile(b.col, b.row);
    }
    if (onSelectBuilding) {
      onSelectBuilding(b);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {AI_CITY_BUILDINGS.map((b) => {
        const worldX = (b.col + 0.5) * TILE_SIZE;
        const worldY = b.row * TILE_SIZE;
        const screenX = proj.toScreenX(worldX);
        const screenY = proj.toScreenY(worldY);

        // Cull if outside visible screen margin
        if (
          screenX < -200 ||
          screenX > rect.width + 200 ||
          screenY < -150 ||
          screenY > rect.height + 150
        ) {
          return null;
        }

        const isMasjid = b.id === 'masjid';
        const isSelected = selectedBuildingId === b.id;

        return (
          <div
            key={b.id}
            className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto transition-transform active:scale-95 cursor-pointer select-none"
            style={{
              left: Math.round(screenX),
              top: Math.round(screenY - (isMasjid ? 12 : 6)),
            }}
            onClick={() => handleBuildingClick(b)}
            title={`Klik untuk masuk & navigasi ke ${b.name}`}
          >
            {/* 🕌 REAL PIXEL-ART MASJID AI CITY STRUCTURE */}
            {isMasjid ? (
              <div className="flex flex-col items-center group">
                {/* Golden Crescent & Dome Peak */}
                <div className="flex items-center gap-1 -mb-1 z-10">
                  <span className="text-xs text-yellow-300 drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">
                    🌙
                  </span>
                </div>

                {/* Pixel Kubah (Dome) & Minarets Facade */}
                <div className="relative flex items-end">
                  {/* Left Minaret */}
                  <div className="w-3 h-14 bg-gradient-to-t from-emerald-950 via-emerald-800 to-emerald-700 border-x border-t border-emerald-400 flex flex-col items-center justify-between pb-1 shadow-pixel">
                    <span className="text-[7px] text-yellow-300">▲</span>
                    <span className="text-[6px] text-emerald-300">🕌</span>
                  </div>

                  {/* Central Dome (Kubah) & Building Body */}
                  <div
                    className={`px-3 py-1.5 bg-gradient-to-b from-emerald-800 via-emerald-950 to-[#062414] border-2 border-emerald-400 text-white shadow-pixel flex flex-col items-center min-w-[130px] transition-all ${
                      isSelected ? 'ring-2 ring-yellow-400 scale-105' : 'group-hover:border-emerald-300'
                    }`}
                  >
                    {/* Arch Dome Top */}
                    <div className="w-16 h-3 bg-emerald-600/70 border-t border-x border-emerald-300 rounded-t-full -mt-2.5 mb-0.5 flex items-center justify-center">
                      <span className="text-[7px] font-mono text-yellow-200">KUBAH</span>
                    </div>

                    <div className="font-bold text-[11px] tracking-wider text-emerald-200 uppercase leading-none drop-shadow">
                      MASJID AI CITY
                    </div>
                    <div className="text-[8px] text-emerald-300/80 font-mono mt-0.5 leading-none">
                      Pusat Ibadah & Ketenangan
                    </div>

                    {/* Entrance Doors & Mosque Courtyard */}
                    <div className="flex items-center gap-2 mt-1 pt-1 border-t border-emerald-800/80">
                      <span className="text-[10px]" title="Taman Masjid">
                        🌳
                      </span>
                      <span className="text-[10px] bg-[#02180c] px-1 py-0.2 border border-emerald-600/60 text-emerald-200 font-mono">
                        🚪 PINTU
                      </span>
                      <span className="text-[10px]" title="Taman Masjid">
                        🌳
                      </span>
                    </div>
                  </div>

                  {/* Right Minaret */}
                  <div className="w-3 h-14 bg-gradient-to-t from-emerald-950 via-emerald-800 to-emerald-700 border-x border-t border-emerald-400 flex flex-col items-center justify-between pb-1 shadow-pixel">
                    <span className="text-[7px] text-yellow-300">▲</span>
                    <span className="text-[6px] text-emerald-300">🕌</span>
                  </div>
                </div>

                {/* Entry Step Post */}
                <div className="w-10 h-1.5 bg-[#041a0e] border-x border-b border-emerald-500/80"></div>
              </div>
            ) : b.id === 'cafe' ? (
              /* ☕ REAL PIXEL-ART AI CAFÉ BUILDING */
              <div className="flex flex-col items-center group">
                {/* Striped Awning (Canopy) */}
                <div className="w-28 h-2.5 bg-gradient-to-r from-amber-700 via-amber-200 via-amber-700 via-amber-200 to-amber-700 border border-amber-900 shadow-sm"></div>
                <div
                  className={`px-2.5 py-1 bg-[#241508]/95 border-2 border-amber-500 text-white shadow-pixel flex flex-col items-center min-w-[110px] ${
                    isSelected ? 'ring-2 ring-yellow-400 scale-105' : 'group-hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs">☕</span>
                    <span className="font-bold text-[10px] text-amber-200 uppercase">AI CAFÉ</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-amber-300/80 mt-0.5">
                    <span>Espresso Bar</span>
                    <span>·</span>
                    <span>🚪 Pintu</span>
                  </div>
                </div>
                <div className="w-8 h-1 bg-[#180e05] border-x border-amber-700"></div>
              </div>
            ) : b.id === 'coding_lab' ? (
              /* 💻 REAL PIXEL-ART CODING LAB */
              <div className="flex flex-col items-center group">
                <div className="w-24 h-1.5 bg-cyan-700 border-t border-x border-cyan-400"></div>
                <div
                  className={`px-2 py-0.5 bg-[#081824]/95 border-2 border-cyan-500 text-white shadow-pixel flex flex-col items-center min-w-[105px] ${
                    isSelected ? 'ring-2 ring-cyan-300 scale-105' : 'group-hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs">💻</span>
                    <span className="font-bold text-[10px] text-cyan-200 uppercase">CODING LAB</span>
                  </div>
                  <span className="text-[8px] text-cyan-300/70 font-mono mt-0.5">
                    &lt;/&gt; Workstations · 🚪
                  </span>
                </div>
                <div className="w-6 h-1 bg-[#05101a] border-x border-cyan-600"></div>
              </div>
            ) : b.signboardType === 'standard' ? (
              /* Standard Building Signboard */
              <div className="flex flex-col items-center">
                <div
                  className={`px-2 py-0.5 bg-[#141420]/95 border-2 border-[#363650] text-white shadow-pixel flex items-center gap-1 whitespace-nowrap ${
                    isSelected ? 'border-accent-bright bg-[#202034] scale-105' : ''
                  }`}
                >
                  <span className="text-xs leading-none">{b.icon}</span>
                  <span className="font-bold text-[10px] tracking-wide text-white/95 leading-none">
                    {b.name}
                  </span>
                  <span className="text-[8px] text-text-muted ml-0.5">🚪</span>
                </div>
                <div className="w-0.5 h-1.5 bg-[#363650]"></div>
              </div>
            ) : (
              /* Compact Facade Sign */
              <div className="flex flex-col items-center">
                <div
                  className={`px-1.5 py-0.2 bg-[#101018]/90 border border-[#2b2b3e] text-white shadow-sm flex items-center gap-0.5 whitespace-nowrap opacity-90 hover:opacity-100 ${
                    isSelected ? 'border-accent-bright opacity-100 scale-105' : ''
                  }`}
                >
                  <span className="text-[10px] leading-none">{b.icon}</span>
                  <span className="font-medium text-[9px] text-text-muted leading-none">
                    {b.shortName}
                  </span>
                </div>
                <div className="w-0.5 h-1 bg-[#2b2b3e]"></div>
              </div>
            )}

            {/* Interactive Building Detail Card on Click */}
            {isSelected && (
              <div className="mt-1 p-2.5 bg-[#141422] border-2 border-accent text-white shadow-pixel w-48 text-left pointer-events-auto z-30 animate-in fade-in">
                <div className="flex items-center justify-between pb-1 border-b border-[#2b2b40]">
                  <span className="font-bold text-[10px] text-accent-bright flex items-center gap-1 truncate">
                    <span>{b.icon}</span>
                    <span className="truncate">{b.name}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBuildingId(null);
                    }}
                    className="text-[9px] text-text-muted hover:text-white px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[9px] text-text-muted mt-1 leading-snug">{b.description}</p>
                {b.subareas && b.subareas.length > 0 && (
                  <div className="mt-1.5 pt-1 border-t border-[#242436]">
                    <span className="text-[8px] uppercase tracking-wider text-text-muted font-semibold block">
                      Interior & Fasilitas:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {b.subareas.map((sub, i) => (
                        <span
                          key={i}
                          className="text-[8px] bg-[#1a1a2c] text-emerald-300 px-1 py-0.2 font-mono"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
