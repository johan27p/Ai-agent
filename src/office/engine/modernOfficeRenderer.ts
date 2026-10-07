/**
 * High-definition pixel-art renderer for:
 * 1. Modern Ergonomic Mesh Office Chairs (Kursi Kantor Ergonomis Herman Miller / Swivel Chairs)
 * 2. Modern Curved Ultrawide & Dual Monitor Workstations (Monitor PC Modern)
 * 3. Modern Executive Meeting Room:
 *    - Large Conference Table with Cable Wells & Speakerphone Pods (Meja Meeting)
 *    - Executive Meeting Chairs (Kursi Meeting)
 *    - Wall-Mounted Big Conference Presentation Display with Live Slides & Diagrams (Monitor Meeting Besar)
 */

export interface ModernMeetingRoomData {
  tableCol: number;
  tableRow: number;
  monitorCol: number;
  monitorRow: number;
}

export const CITY_MEETING_ROOM: ModernMeetingRoomData = {
  tableCol: 46,
  tableRow: 38,
  monitorCol: 48,
  monitorRow: 31,
};

export const MODERN_DEV_WORKSTATIONS = [
  // Coding Lab Pods (Cols 6..18, Rows 34..46)
  { col: 8, row: 34, type: 'ultrawide' },
  { col: 15, row: 34, type: 'dual' },
  { col: 8, row: 43, type: 'dual' },
  { col: 15, row: 43, type: 'ultrawide' },

  // Testing Lab Pods (Cols 24..34, Rows 34..46)
  { col: 26, row: 34, type: 'dual' },
  { col: 32, row: 34, type: 'ultrawide' },
  { col: 29, row: 43, type: 'dual' },

  // HQ Executive Desk (Col 19, Row 8)
  { col: 19, row: 8, type: 'ultrawide' },
];

/**
 * Renders the Wall-Mounted Big Conference Presentation Display in the Meeting Room
 */
export function renderMeetingWallMonitor(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const mx = Math.round(offsetX + col * 16 * zoom);
  const my = Math.round(offsetY + row * 16 * zoom);
  const time = Date.now() / 1000;

  ctx.save();
  ctx.translate(mx, my);

  const displayW = 44 * z;
  const displayH = 24 * z;

  // Ambient Wall Glow Backlight
  ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
  ctx.fillRect(-2 * z, -2 * z, displayW + 4 * z, displayH + 4 * z);

  // Slim Titanium Bezel
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, displayW, displayH);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1 * z;
  ctx.strokeRect(0, 0, displayW, displayH);

  // Active Screen Panel (Deep Navy Blue / Dark Slate)
  ctx.fillStyle = '#0b1120';
  ctx.fillRect(1.5 * z, 1.5 * z, displayW - 3 * z, displayH - 3 * z);

  // Animated Screen Content: Cycles between Architecture Diagram, Pie Chart, and Video Grid
  const slideCycle = Math.floor(time / 5) % 3;

  if (slideCycle === 0) {
    // 📊 SLIDE 1: Architecture Cloud Infrastructure & Data Flow
    // Header Bar
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(3 * z, 3 * z, displayW - 6 * z, 2.5 * z);

    // Microservice Node Blocks
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(5 * z, 8 * z, 8 * z, 5 * z);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(18 * z, 8 * z, 8 * z, 5 * z);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(31 * z, 8 * z, 8 * z, 5 * z);

    // Connecting Data Bus Lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1 * z;
    ctx.beginPath();
    ctx.moveTo(13 * z, 10.5 * z);
    ctx.lineTo(18 * z, 10.5 * z);
    ctx.moveTo(26 * z, 10.5 * z);
    ctx.lineTo(31 * z, 10.5 * z);
    ctx.stroke();

    // Live Metrics graph at bottom
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < 6; i++) {
      const barH = (3 + Math.sin(time * 3 + i) * 2) * z;
      ctx.fillRect((8 + i * 5) * z, 20 * z - barH, 3 * z, barH);
    }
  } else if (slideCycle === 1) {
    // 📈 SLIDE 2: AI Sprint Velocity & Performance Chart
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(3 * z, 3 * z, displayW - 6 * z, 2.5 * z);

    // Pie Chart ring
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(12 * z, 14 * z, 6 * z, 0, Math.PI * 1.3);
    ctx.lineTo(12 * z, 14 * z);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(12 * z, 14 * z, 6 * z, Math.PI * 1.3, Math.PI * 2);
    ctx.lineTo(12 * z, 14 * z);
    ctx.fill();

    // Bullet points on the right
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(22 * z, 9 * z, 16 * z, 1.5 * z);
    ctx.fillRect(22 * z, 13 * z, 12 * z, 1.5 * z);
    ctx.fillRect(22 * z, 17 * z, 14 * z, 1.5 * z);
  } else {
    // 👥 SLIDE 3: Remote Video Conference Grid (6 participants)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        const vx = (4 + c * 12) * z;
        const vy = (4 + r * 9) * z;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(vx, vy, 10 * z, 7 * z);
        // Participant silhouette
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(vx + 5 * z, vy + 3 * z, 2 * z, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(vx + 2 * z, vy + 5 * z, 6 * z, 2 * z);
      }
    }
  }

  // Camera lens at top center
  ctx.fillStyle = '#22c55e'; // Green active camera LED
  ctx.fillRect(displayW / 2 - 0.5 * z, 0.5 * z, 1 * z, 1 * z);

  ctx.restore();
}

/**
 * Renders the Large Modern Executive Conference Table in the Meeting Room
 */
export function renderModernConferenceTable(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const tx = Math.round(offsetX + col * 16 * zoom);
  const ty = Math.round(offsetY + row * 16 * zoom);

  ctx.save();
  ctx.translate(tx, ty);

  const tableW = 96 * z; // 6 tiles wide
  const tableH = 48 * z; // 3 tiles deep

  // Floor Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(-4 * z, 6 * z, tableW + 8 * z, tableH, 8 * z);
  ctx.fill();

  // Polished Dark Walnut / Carbon Table Surface
  ctx.fillStyle = '#1e222d';
  ctx.beginPath();
  ctx.roundRect(0, 0, tableW, tableH, 6 * z);
  ctx.fill();

  // Chamfered Edge Highlight
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.2 * z;
  ctx.stroke();

  // Frosted Glass / Aluminum Center Inlay Strip
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(12 * z, 18 * z, tableW - 24 * z, 12 * z);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 0.8 * z;
  ctx.strokeRect(12 * z, 18 * z, tableW - 24 * z, 12 * z);

  // Conference Speakerphone Polycom Pod (Octagonal star in center)
  const cx = tableW / 2;
  const cy = 24 * z;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(cx, cy, 4 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#06b6d4'; // Center mute/active blue LED
  ctx.beginPath();
  ctx.arc(cx, cy, 1.5 * z, 0, Math.PI * 2);
  ctx.fill();

  // Integrated Laptops & Note Tablets at seating positions
  const laptopPositions = [
    { x: 18 * z, y: 8 * z },
    { x: 42 * z, y: 8 * z },
    { x: 68 * z, y: 8 * z },
    { x: 18 * z, y: 34 * z },
    { x: 42 * z, y: 34 * z },
    { x: 68 * z, y: 34 * z },
  ];

  for (const lp of laptopPositions) {
    // Ultra-slim silver laptop base
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(lp.x, lp.y, 8 * z, 5 * z);
    // Glowing screen
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lp.x + 1 * z, lp.y + 0.5 * z, 6 * z, 3 * z);
  }

  // Modern Ergonomic Conference Chairs positioned around the table
  const chairPositions = [
    // North Row (facing down)
    { x: 16 * z, y: -6 * z, dir: 'front' },
    { x: 40 * z, y: -6 * z, dir: 'front' },
    { x: 66 * z, y: -6 * z, dir: 'front' },
    // South Row (facing up)
    { x: 16 * z, y: 44 * z, dir: 'back' },
    { x: 40 * z, y: 44 * z, dir: 'back' },
    { x: 66 * z, y: 44 * z, dir: 'back' },
    // West & East Executive Heads
    { x: -8 * z, y: 20 * z, dir: 'side' },
    { x: tableW + 2 * z, y: 20 * z, dir: 'side' },
  ];

  for (const cp of chairPositions) {
    renderErgonomicChairAt(ctx, cp.x, cp.y, z, cp.dir);
  }

  ctx.restore();
}

/**
 * Draws a modern ergonomic swivel office chair (Herman Miller Aeron style)
 */
function renderErgonomicChairAt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  z: number,
  dir: string,
): void {
  ctx.save();
  ctx.translate(x, y);

  // Chrome 5-star swivel wheel base
  ctx.fillStyle = '#64748b';
  ctx.fillRect(2 * z, 8 * z, 8 * z, 1.5 * z);
  ctx.fillStyle = '#0f172a'; // Wheels
  ctx.fillRect(1 * z, 9 * z, 1.5 * z, 1.5 * z);
  ctx.fillRect(9.5 * z, 9 * z, 1.5 * z, 1.5 * z);

  // Pneumatic cylinder
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(5 * z, 5 * z, 2 * z, 4 * z);

  // Padded contoured seat cushion
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(1 * z, 3 * z, 10 * z, 4 * z, 2 * z);
  ctx.fill();

  // Ergonomic Mesh Backrest with Lumbar Curve
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(1.5 * z, -6 * z, 9 * z, 9 * z, 2.5 * z);
  ctx.fill();

  // Translucent mesh texture
  ctx.fillStyle = '#334155';
  ctx.fillRect(3 * z, -4 * z, 6 * z, 6 * z);

  // Sleek Armrests
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, -1 * z, 1.5 * z, 4 * z);
  ctx.fillRect(10.5 * z, -1 * z, 1.5 * z, 4 * z);

  ctx.restore();
}

/**
 * Draws Modern Ultrawide & Dual Monitor Workstations in Dev & Testing Labs
 */
export function renderModernWorkstation(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  type: string,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const wx = Math.round(offsetX + col * 16 * zoom);
  const wy = Math.round(offsetY + row * 16 * zoom);
  const time = Date.now() / 150;

  ctx.save();
  ctx.translate(wx, wy);

  if (type === 'ultrawide') {
    // ── Curved 34" Ultrawide Monitor ─────────────────────────────────────────
    const monW = 20 * z;
    const monH = 10 * z;

    // Ambient RGB Backlight Aura
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.beginPath();
    ctx.arc(monW / 2, 2 * z, 12 * z, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Metal Stand & Arm
    ctx.fillStyle = '#475569';
    ctx.fillRect(monW / 2 - 1.5 * z, 4 * z, 3 * z, 7 * z);
    ctx.fillRect(monW / 2 - 4 * z, 10 * z, 8 * z, 1.5 * z);

    // Bezel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -2 * z, monW, monH);

    // OLED Curved Screen with VS Code IDE theme
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(1 * z, -1 * z, monW - 2 * z, monH - 2 * z);

    // Sidebar Explorer
    ctx.fillStyle = '#252526';
    ctx.fillRect(1 * z, -1 * z, 3 * z, monH - 2 * z);

    // Code lines (Syntax Colored: Cyan, Yellow, Purple, Green)
    const codeTick = Math.floor(time) % 4;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(5 * z, 0.5 * z, 6 * z, 1 * z);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(5 * z, 2.5 * z, 8 * z, 1 * z);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(5 * z, 4.5 * z, 7 * z, 1 * z);
    ctx.fillStyle = codeTick === 0 ? '#4ade80' : '#22c55e';
    ctx.fillRect(5 * z, 6.5 * z, 5 * z, 1 * z);

    // Mechanical Keyboard with RGB Glow
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(monW / 2 - 6 * z, 12 * z, 12 * z, 4 * z);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.6)'; // Purple RGB keys
    ctx.fillRect(monW / 2 - 5 * z, 12.5 * z, 10 * z, 2.8 * z);
  } else {
    // ── Dual Monitor Setup (Landscape Code + Vertical Terminal) ──────────────
    // Screen 1: Primary 27" 16:9 Screen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, -2 * z, 13 * z, 9 * z);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0.8 * z, -1.2 * z, 11.4 * z, 7.4 * z);

    // Code lines on primary
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(2 * z, 0, 7 * z, 1 * z);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(2 * z, 2 * z, 5 * z, 1 * z);

    // Screen 2: Vertical Portrait Screen (Debugger / Server Log)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14 * z, -5 * z, 7 * z, 12 * z);
    ctx.fillStyle = '#14532d'; // Green matrix log screen
    ctx.fillRect(14.6 * z, -4.4 * z, 5.8 * z, 10.8 * z);

    // Vertical stream lines
    ctx.fillStyle = '#4ade80';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(15.5 * z, (-3 + i * 2.5) * z, 4 * z, 0.8 * z);
    }
  }

  ctx.restore();
}
