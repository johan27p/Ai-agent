/**
 * Browser runtime mock — fetches assets and injects the same postMessage
 * events the VS Code extension would send.
 *
 * In Vite dev, it prefers pre-decoded JSON endpoints from middleware.
 * In plain browser builds, it falls back to decoding PNGs at runtime.
 *
 * Only imported in browser runtime; tree-shaken from VS Code webview runtime.
 */

import { rgbaToHex } from './core/src/assets/colorUtils.ts';
import {
  CHAR_FRAME_H,
  CHAR_FRAME_W,
  CHAR_FRAMES_PER_ROW,
  CHARACTER_DIRECTIONS,
  FLOOR_TILE_SIZE,
  WALL_BITMASK_COUNT,
  WALL_GRID_COLS,
  WALL_PIECE_HEIGHT,
  WALL_PIECE_WIDTH,
} from './core/src/assets/constants.ts';
import type {
  AssetIndex,
  CatalogEntry,
  CharacterDirectionSprites,
} from './core/src/assets/types.ts';
import { generateLargeAICityLayout } from './city/largeCityLayout.js';
import { hqStore } from './hq/hqStore.js';

interface MockPayload {
  characters: CharacterDirectionSprites[];
  floorSprites: string[][][];
  wallSets: string[][][][];
  carpetSets: string[][][][];
  furnitureCatalog: CatalogEntry[];
  furnitureSprites: Record<string, string[][]>;
  layout: unknown;
}

// ── Module-level state ─────────────────────────────────────────────────────────

let mockPayload: MockPayload | null = null;

// ── PNG decode helpers (browser fallback) ───────────────────────────────────

interface DecodedPng {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

function getPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): [number, number, number, number] {
  const idx = (y * width + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
}

function readSprite(
  png: DecodedPng,
  width: number,
  height: number,
  offsetX = 0,
  offsetY = 0,
): string[][] {
  const sprite: string[][] = [];
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(png.data, png.width, offsetX + x, offsetY + y);
      row.push(rgbaToHex(r, g, b, a));
    }
    sprite.push(row);
  }
  return sprite;
}

async function decodePng(url: string): Promise<DecodedPng> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch PNG: ${url} (${res.status.toString()})`);
  }
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Failed to create 2d canvas context for PNG decode');
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { width: canvas.width, height: canvas.height, data: imageData.data };
}

async function fetchJsonOptional<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function getIndexedAssetPath(kind: 'characters' | 'floors' | 'walls', relPath: string): string {
  return relPath.startsWith(`${kind}/`) ? relPath : `${kind}/${relPath}`;
}

async function decodeCharactersFromPng(
  base: string,
  index: AssetIndex,
): Promise<CharacterDirectionSprites[]> {
  const sprites: CharacterDirectionSprites[] = [];
  for (const relPath of index.characters) {
    const png = await decodePng(`${base}assets/${getIndexedAssetPath('characters', relPath)}`);
    const byDir: CharacterDirectionSprites = { down: [], up: [], right: [] };

    for (let dirIdx = 0; dirIdx < CHARACTER_DIRECTIONS.length; dirIdx++) {
      const dir = CHARACTER_DIRECTIONS[dirIdx];
      const rowOffsetY = dirIdx * CHAR_FRAME_H;
      const frames: string[][][] = [];
      for (let frame = 0; frame < CHAR_FRAMES_PER_ROW; frame++) {
        frames.push(readSprite(png, CHAR_FRAME_W, CHAR_FRAME_H, frame * CHAR_FRAME_W, rowOffsetY));
      }
      byDir[dir] = frames;
    }

    sprites.push(byDir);
  }
  return sprites;
}

async function decodeFloorsFromPng(base: string, index: AssetIndex): Promise<string[][][]> {
  const floors: string[][][] = [];
  for (const relPath of index.floors) {
    const png = await decodePng(`${base}assets/${getIndexedAssetPath('floors', relPath)}`);
    floors.push(readSprite(png, FLOOR_TILE_SIZE, FLOOR_TILE_SIZE));
  }
  return floors;
}

async function decodeWallsFromPng(base: string, index: AssetIndex): Promise<string[][][][]> {
  const wallSets: string[][][][] = [];
  for (const relPath of index.walls) {
    const png = await decodePng(`${base}assets/${getIndexedAssetPath('walls', relPath)}`);
    const set: string[][][] = [];
    for (let mask = 0; mask < WALL_BITMASK_COUNT; mask++) {
      const ox = (mask % WALL_GRID_COLS) * WALL_PIECE_WIDTH;
      const oy = Math.floor(mask / WALL_GRID_COLS) * WALL_PIECE_HEIGHT;
      set.push(readSprite(png, WALL_PIECE_WIDTH, WALL_PIECE_HEIGHT, ox, oy));
    }
    wallSets.push(set);
  }
  return wallSets;
}

async function decodeFurnitureFromPng(
  base: string,
  catalog: CatalogEntry[],
): Promise<Record<string, string[][]>> {
  const sprites: Record<string, string[][]> = {};
  for (const entry of catalog) {
    const png = await decodePng(`${base}assets/${entry.furniturePath}`);
    sprites[entry.id] = readSprite(png, entry.width, entry.height);
  }
  return sprites;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Call before createRoot() in main.tsx.
 * Fetches all pre-decoded assets from the Vite dev server and stores them
 * for dispatchMockMessages().
 */
export async function initBrowserMock(): Promise<void> {
  console.log('[BrowserMock] Loading assets...');

  const base = import.meta.env.BASE_URL; // '/' in dev, '/sub/' with a subpath, './' in production

  const [assetIndex, catalog] = await Promise.all([
    fetch(`${base}assets/asset-index.json`).then((r) => r.json()) as Promise<AssetIndex>,
    fetch(`${base}assets/furniture-catalog.json`).then((r) => r.json()) as Promise<CatalogEntry[]>,
  ]);

  const shouldTryDecoded = true;
  const [decodedCharacters, decodedFloors, decodedWalls, decodedFurniture] = shouldTryDecoded
    ? await Promise.all([
        fetchJsonOptional<CharacterDirectionSprites[]>(`${base}assets/decoded/characters.json`),
        fetchJsonOptional<string[][][]>(`${base}assets/decoded/floors.json`),
        fetchJsonOptional<string[][][][]>(`${base}assets/decoded/walls.json`),
        fetchJsonOptional<Record<string, string[][]>>(`${base}assets/decoded/furniture.json`),
      ])
    : [null, null, null, null];

  const hasDecoded = !!(decodedCharacters && decodedFloors && decodedWalls && decodedFurniture);

  if (!hasDecoded) {
    if (shouldTryDecoded) {
      console.log('[BrowserMock] Decoded JSON not found, decoding PNG assets in browser...');
    } else {
      console.log('[BrowserMock] Decoding PNG assets in browser...');
    }
  }

  const [characters, floorSprites, wallSets, furnitureSprites] = hasDecoded
    ? [decodedCharacters!, decodedFloors!, decodedWalls!, decodedFurniture!]
    : await Promise.all([
        decodeCharactersFromPng(base, assetIndex),
        decodeFloorsFromPng(base, assetIndex),
        decodeWallsFromPng(base, assetIndex),
        decodeFurnitureFromPng(base, catalog),
      ]);

  let layout = null;
  const savedLayoutStr =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('pixel_agents_office_layout')
      : null;
  if (savedLayoutStr) {
    try {
      layout = JSON.parse(savedLayoutStr);
    } catch {
      layout = null;
    }
  }
  if (!layout && assetIndex.defaultLayout) {
    try {
      layout = await fetch(`${base}assets/${assetIndex.defaultLayout}`).then((r) => r.json());
    } catch {
      layout = null;
    }
  }

  // Ensure Large AI City layout (80 x 60) with modern offices & traffic is always loaded
  if (!layout || !layout.cols || layout.cols < 80 || (layout.layoutRevision ?? 0) < 15) {
    layout = generateLargeAICityLayout();
  }

  // Carpets only have a decoded-JSON endpoint (no PNG fallback / asset-index
  // entry); empty array is fine — the carpet tab just won't render variants.
  const carpetSets =
    (await fetchJsonOptional<string[][][][]>(`${base}assets/decoded/carpets.json`)) ?? [];

  mockPayload = {
    characters,
    floorSprites,
    wallSets,
    carpetSets,
    furnitureCatalog: catalog,
    furnitureSprites,
    layout,
  };

  console.log(
    `[BrowserMock] Ready (${hasDecoded ? 'decoded-json' : 'browser-png-decode'}) — ${characters.length} chars, ${floorSprites.length} floors, ${wallSets.length} wall sets, ${carpetSets.length} carpets, ${catalog.length} furniture items`,
  );
}

// ── Agent Simulation & Interactivity State ───────────────────────────────────────

let nextAgentId = 3;
let simulationInterval: ReturnType<typeof setInterval> | null = null;
const activeSimAgents = new Set<number>([1, 2]);

const SIM_ACTIVITIES: Array<{
  toolName: string;
  status: string;
  permission?: boolean;
}> = [
  { toolName: 'Edit', status: 'Editing src/office/engine/renderer.ts' },
  { toolName: 'Read', status: 'Reading project architecture & docs' },
  { toolName: 'Bash', status: 'Running tests: npm test' },
  { toolName: 'Edit', status: 'Updating Tailwind styling in index.css' },
  { toolName: 'Grep', status: 'Searching for references in codebase' },
  { toolName: 'Bash', status: 'Building bundle: vite build' },
  { toolName: 'Bash', status: 'Awaiting permission: git commit -m "feat: pixel office"', permission: true },
  { toolName: 'Edit', status: 'Adding animated office furniture sprite' },
];

/**
 * Call inside a useEffect in App.tsx -- after the window message listener
 * in useExtensionMessages has been registered.
 *
 * Only used in Vite dev mode (npm run dev). In standalone server mode and
 * VS Code mode, the server/extension sends all state over the transport.
 */
export function dispatchMockMessages(): void {
  if (!mockPayload) return;

  const {
    characters,
    floorSprites,
    wallSets,
    carpetSets,
    furnitureCatalog,
    furnitureSprites,
    layout,
  } = mockPayload;

  function dispatch(data: unknown): void {
    window.dispatchEvent(new MessageEvent('message', { data }));
  }

  // Must match the load order defined in CLAUDE.md:
  // characterSpritesLoaded -> floorTilesLoaded -> wallTilesLoaded -> carpetTilesLoaded
  //   -> furnitureAssetsLoaded -> layoutLoaded
  dispatch({ type: 'characterSpritesLoaded', characters });
  dispatch({ type: 'floorTilesLoaded', sprites: floorSprites });
  dispatch({ type: 'wallTilesLoaded', sets: wallSets });
  dispatch({ type: 'carpetTilesLoaded', sets: carpetSets });
  dispatch({ type: 'furnitureAssetsLoaded', catalog: furnitureCatalog, sprites: furnitureSprites });
  dispatch({ type: 'layoutLoaded', layout });

  const soundPref =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('pixel_agents_sound_enabled') === 'true'
      : false;

  dispatch({
    type: 'settingsLoaded',
    soundEnabled: soundPref,
    extensionVersion: '1.4.1',
    lastSeenVersion: '1.3',
  });

  dispatch({
    type: 'providerCapabilities',
    readingTools: ['Read', 'Glob', 'Grep'],
    subagentToolNames: ['Task', 'Subagent'],
  });

  dispatch({
    type: 'workspaceFolders',
    folders: [
      { name: 'pixel-agents', path: '/workspace/pixel-agents' },
      { name: 'backend-service', path: '/workspace/backend-service' },
    ],
  });

  // Spawn AI HQ Company Team (Roles & Hierarchy)
  for (const a of hqStore.agents) {
    activeSimAgents.add(a.id);
    dispatch({
      type: 'agentCreated',
      id: a.id,
      folderName: a.location,
      palette: a.palette,
      isExternal: false,
    });
    dispatch({
      type: 'agentToolStart',
      id: a.id,
      toolId: `t-${a.id}-init`,
      status: a.currentTask,
      toolName:
        a.role === 'coder' || a.role === 'debugger'
          ? 'Edit'
          : a.role === 'tester'
          ? 'Bash'
          : 'Read',
    });
  }

  console.log(
    `[BrowserMock] AI HQ Company online with ${hqStore.agents.length} active agents across hierarchy`,
  );

  // Handle client messages dispatched through transport.send
  if (typeof window !== 'undefined') {
    const handleClientMessage = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type: string;
        id?: number;
        layout?: unknown;
        enabled?: boolean;
        folderPath?: string;
        bypassPermissions?: boolean;
      }>;
      const msg = customEvent.detail;
      if (!msg) return;

      if (msg.type === 'launchAgent') {
        const id = nextAgentId++;
        activeSimAgents.add(id);
        const folder = msg.folderPath ? msg.folderPath.split('/').pop() || 'new-feature' : 'applet-dev';
        dispatch({
          type: 'agentCreated',
          id,
          folderName: folder,
          palette: (id - 1) % 6,
          isExternal: false,
        });
        dispatch({
          type: 'agentToolStart',
          id,
          toolId: `t-${id}-start`,
          status: 'Initializing coding agent workspace',
          toolName: 'Bash',
        });
      } else if (msg.type === 'closeAgent' && typeof msg.id === 'number') {
        activeSimAgents.delete(msg.id);
        dispatch({ type: 'agentClosed', id: msg.id });
      } else if (msg.type === 'saveLayout' && msg.layout) {
        try {
          localStorage.setItem('pixel_agents_office_layout', JSON.stringify(msg.layout));
        } catch {
          // Ignore quota errors
        }
      } else if (msg.type === 'setSoundEnabled' && typeof msg.enabled === 'boolean') {
        try {
          localStorage.setItem('pixel_agents_sound_enabled', String(msg.enabled));
        } catch {
          // Ignore quota errors
        }
      }
    };

    window.removeEventListener('clientMessage', handleClientMessage);
    window.addEventListener('clientMessage', handleClientMessage);

    // Activity simulation loop
    if (simulationInterval) clearInterval(simulationInterval);
    simulationInterval = setInterval(() => {
      const agentIds = Array.from(activeSimAgents);
      if (agentIds.length === 0) return;

      const randomId = agentIds[Math.floor(Math.random() * agentIds.length)];
      const randomActivity = SIM_ACTIVITIES[Math.floor(Math.random() * SIM_ACTIVITIES.length)];
      const toolId = `tool-${randomId}-${Date.now().toString().slice(-4)}`;

      if (randomActivity.permission) {
        dispatch({
          type: 'agentToolStart',
          id: randomId,
          toolId,
          status: randomActivity.status,
          toolName: randomActivity.toolName,
          permissionActive: true,
        });
        dispatch({ type: 'agentToolPermission', id: randomId });
      } else {
        dispatch({ type: 'agentToolPermissionClear', id: randomId });
        dispatch({
          type: 'agentToolStart',
          id: randomId,
          toolId,
          status: randomActivity.status,
          toolName: randomActivity.toolName,
        });
      }

      // Finish tool after a short while
      setTimeout(() => {
        dispatch({ type: 'agentToolDone', id: randomId, toolId });
        dispatch({ type: 'agentStatus', id: randomId, status: 'waiting' });
      }, 5000);
    }, 8000);
  }
}
