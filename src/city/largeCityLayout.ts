import type { OfficeLayout, PlacedFurniture, TileType, CarpetTile } from '../office/types.js';

export const CITY_COLS = 80;
export const CITY_ROWS = 60;

/**
 * Builds the complete, massive Large AI City Layout (80 x 60 tiles)
 * with authentic physical walls, floors, doors, interior rooms, green sajadah carpets,
 * and comprehensive furniture for every building.
 */
export function generateLargeAICityLayout(): OfficeLayout {
  const cols = CITY_COLS;
  const rows = CITY_ROWS;
  const totalTiles = cols * rows;

  // Initialize all tiles as exterior walkable city pavement (TileType.FLOOR_1 = 1)
  const tiles: TileType[] = new Array(totalTiles).fill(1 as TileType);
  const carpetTiles: Array<CarpetTile | null> = new Array(totalTiles).fill(null);
  const furniture: PlacedFurniture[] = [];

  let uidCounter = 1;
  const addFurniture = (type: string, col: number, row: number) => {
    furniture.push({
      uid: `city_furn_${uidCounter++}`,
      type,
      col,
      row,
    });
  };

  const setTile = (c: number, r: number, tileType: TileType) => {
    if (c >= 0 && c < cols && r >= 0 && r < rows) {
      tiles[r * cols + c] = tileType;
    }
  };

  const fillRect = (c1: number, r1: number, c2: number, r2: number, tileType: TileType) => {
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        setTile(c, r, tileType);
      }
    }
  };

  // Outer world borders (Wall = 0)
  for (let c = 0; c < cols; c++) {
    setTile(c, 0, 0 as TileType);
    setTile(c, rows - 1, 0 as TileType);
  }
  for (let r = 0; r < rows; r++) {
    setTile(0, r, 0 as TileType);
    setTile(cols - 1, r, 0 as TileType);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. 🕌 MASJID AI CITY (Size: 36 x 24 tiles! Cols: 42..77, Rows: 2..26)
  // ─────────────────────────────────────────────────────────────────────────────
  // Floor interior: Floor 3
  fillRect(43, 3, 76, 25, 3 as TileType);

  // Exterior Walls
  for (let c = 42; c <= 77; c++) {
    setTile(c, 2, 0 as TileType); // Top wall
    setTile(c, 26, 0 as TileType); // Bottom wall
  }
  for (let r = 2; r <= 26; r++) {
    setTile(42, r, 0 as TileType); // Left wall
    setTile(77, r, 0 as TileType); // Right wall
  }
  // Grand Entrance Doors opening south to Boulevard
  setTile(59, 26, 3 as TileType);
  setTile(60, 26, 3 as TileType);

  // Interior Divider Wall between Wudhu Area and Main Prayer Hall
  for (let r = 3; r <= 25; r++) {
    setTile(49, r, 0 as TileType);
  }
  // Doorway between Wudhu and Prayer Hall
  setTile(49, 14, 3 as TileType);
  setTile(49, 15, 3 as TileType);

  // Green Sajadah Prayer Carpets (Rows: 6..22, Cols: 52..74)
  for (let r = 6; r <= 22; r++) {
    for (let c = 52; c <= 74; c++) {
      carpetTiles[r * cols + c] = {
        variant: 0,
        color: { h: 145, s: 60, b: 35, c: 0 },
        accentColor: { h: 145, s: 75, b: 50, c: 0 },
      };
    }
  }

  // Masjid Interior Furniture:
  // Mihrab at North wall
  addFurniture('CLOCK', 63, 3);
  addFurniture('LARGE_PAINTING', 61, 3);
  addFurniture('LARGE_PAINTING', 65, 3);
  // Shoe area & Benches
  addFurniture('WOODEN_BENCH', 56, 24);
  addFurniture('WOODEN_BENCH', 62, 24);
  // Courtyard & Entrance Plants
  addFurniture('LARGE_PLANT', 57, 25);
  addFurniture('LARGE_PLANT', 62, 25);
  addFurniture('PLANT', 44, 4);
  addFurniture('PLANT', 44, 24);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. 🏢 AI HEADQUARTERS & COMMAND CENTER (Size: 34 x 24 tiles! Cols: 3..37, Rows: 2..26)
  // ─────────────────────────────────────────────────────────────────────────────
  fillRect(4, 3, 36, 25, 2 as TileType);

  // Exterior Walls
  for (let c = 3; c <= 37; c++) {
    setTile(c, 2, 0 as TileType);
    setTile(c, 26, 0 as TileType);
  }
  for (let r = 2; r <= 26; r++) {
    setTile(3, r, 0 as TileType);
    setTile(37, r, 0 as TileType);
  }
  // HQ Entrance Door opening south to Boulevard
  setTile(19, 26, 2 as TileType);
  setTile(20, 26, 2 as TileType);

  // Interior Divider (Command Center / Reception)
  for (let c = 4; c <= 36; c++) {
    setTile(c, 14, 0 as TileType);
  }
  setTile(19, 14, 2 as TileType);
  setTile(20, 14, 2 as TileType);

  // Room Divider between Director Office and Manager
  for (let r = 3; r <= 13; r++) {
    setTile(19, r, 0 as TileType);
  }
  setTile(19, 8, 2 as TileType);

  // Director Office Furniture (Cols 4..18, Rows 3..13)
  addFurniture('DESK_FRONT', 8, 6);
  addFurniture('PC_FRONT_ON_1', 9, 6);
  addFurniture('CUSHIONED_CHAIR_FRONT', 9, 8);
  addFurniture('WHITEBOARD', 13, 3);
  addFurniture('BOOKSHELF', 5, 3);
  addFurniture('PLANT', 5, 12);

  // Manager & Command Center Furniture (Cols 20..36, Rows 3..13)
  addFurniture('DESK_FRONT', 25, 6);
  addFurniture('PC_FRONT_ON_2', 26, 6);
  addFurniture('CUSHIONED_CHAIR_FRONT', 26, 8);
  addFurniture('WHITEBOARD', 30, 3);
  addFurniture('DOUBLE_BOOKSHELF', 21, 3);
  addFurniture('PLANT', 34, 12);

  // Lobby & Reception (Cols 4..36, Rows 15..25)
  addFurniture('DESK_FRONT', 18, 19);
  addFurniture('PC_FRONT_ON_3', 19, 19);
  addFurniture('WOODEN_CHAIR_FRONT', 19, 21);
  addFurniture('SOFA_FRONT', 8, 20);
  addFurniture('SOFA_FRONT', 28, 20);
  addFurniture('COFFEE_TABLE', 10, 22);
  addFurniture('COFFEE', 10, 22);
  addFurniture('LARGE_PLANT', 5, 24);
  addFurniture('LARGE_PLANT', 34, 24);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. 💻 CODING LAB & 🧪 TESTING LAB (Size: 34 x 22 tiles! Cols: 3..37, Rows: 30..52)
  // ─────────────────────────────────────────────────────────────────────────────
  fillRect(4, 31, 36, 51, 4 as TileType);

  // Exterior Walls
  for (let c = 3; c <= 37; c++) {
    setTile(c, 30, 0 as TileType);
    setTile(c, 52, 0 as TileType);
  }
  for (let r = 30; r <= 52; r++) {
    setTile(3, r, 0 as TileType);
    setTile(37, r, 0 as TileType);
  }
  // North Entrance Door to Boulevard
  setTile(19, 30, 4 as TileType);
  setTile(20, 30, 4 as TileType);

  // Interior Divider between Coding Lab and Testing Lab
  for (let r = 31; r <= 51; r++) {
    setTile(20, r, 0 as TileType);
  }
  setTile(20, 41, 4 as TileType);
  setTile(20, 42, 4 as TileType);

  // Coding Lab Workstations (Cols 4..19, Rows 31..51)
  // Desk Pod 1 (Coder Devon)
  addFurniture('DESK_FRONT', 7, 34);
  addFurniture('PC_FRONT_ON_1', 8, 34);
  addFurniture('WOODEN_CHAIR_FRONT', 8, 36);

  // Desk Pod 2 (Debugger Fikri)
  addFurniture('DESK_FRONT', 14, 34);
  addFurniture('PC_FRONT_ON_2', 15, 34);
  addFurniture('WOODEN_CHAIR_FRONT', 15, 36);

  // Desk Pod 3 (Reviewer Kenji)
  addFurniture('DESK_FRONT', 7, 43);
  addFurniture('PC_FRONT_ON_3', 8, 43);
  addFurniture('WOODEN_CHAIR_FRONT', 8, 45);

  // Desk Pod 4 (Researcher Dr. Maya)
  addFurniture('DESK_FRONT', 14, 43);
  addFurniture('PC_FRONT_OFF', 15, 43);
  addFurniture('WOODEN_CHAIR_FRONT', 15, 45);

  addFurniture('WHITEBOARD', 8, 31);
  addFurniture('DOUBLE_BOOKSHELF', 4, 31);
  addFurniture('BIN', 5, 49);

  // Testing Lab Workstations (Cols 21..36, Rows 31..51)
  // QA Tester Tara
  addFurniture('DESK_FRONT', 25, 34);
  addFurniture('PC_FRONT_ON_1', 26, 34);
  addFurniture('WOODEN_CHAIR_FRONT', 26, 36);

  // Security Farhan
  addFurniture('DESK_FRONT', 31, 34);
  addFurniture('PC_FRONT_ON_2', 32, 34);
  addFurniture('WOODEN_CHAIR_FRONT', 32, 36);

  // Automation Rig
  addFurniture('DESK_FRONT', 28, 43);
  addFurniture('PC_FRONT_ON_3', 29, 43);
  addFurniture('WOODEN_CHAIR_FRONT', 29, 45);

  addFurniture('WHITEBOARD', 26, 31);
  addFurniture('DOUBLE_BOOKSHELF', 33, 31);
  addFurniture('BIN', 34, 49);

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. 🤝 MEETING CENTER & ☕ AI CAFÉ (Size: 36 x 22 tiles! Cols: 42..77, Rows: 30..52)
  // ─────────────────────────────────────────────────────────────────────────────
  fillRect(43, 31, 76, 51, 6 as TileType);

  // Exterior Walls
  for (let c = 42; c <= 77; c++) {
    setTile(c, 30, 0 as TileType);
    setTile(c, 52, 0 as TileType);
  }
  for (let r = 30; r <= 52; r++) {
    setTile(42, r, 0 as TileType);
    setTile(77, r, 0 as TileType);
  }
  // North Entrance Door to Boulevard
  setTile(59, 30, 6 as TileType);
  setTile(60, 30, 6 as TileType);

  // Divider between Meeting Room and AI Café
  for (let r = 31; r <= 51; r++) {
    setTile(58, r, 0 as TileType);
  }
  setTile(58, 41, 6 as TileType);
  setTile(58, 42, 6 as TileType);

  // Modern Executive Meeting Room (Cols 43..57, Rows 31..51)
  addFurniture('LARGE_PAINTING', 45, 31);
  addFurniture('LARGE_PAINTING', 53, 31);
  addFurniture('DOUBLE_BOOKSHELF', 43, 33);
  addFurniture('DOUBLE_BOOKSHELF', 55, 33);
  addFurniture('LARGE_PLANT', 44, 49);
  addFurniture('LARGE_PLANT', 55, 49);

  // AI Café (Cols 59..76, Rows 31..51)
  fillRect(59, 31, 76, 51, 7 as TileType);
  // Barista Luna's Counter & Espresso Bar
  addFurniture('DESK_FRONT', 67, 34);
  addFurniture('COFFEE', 68, 34);
  addFurniture('WOODEN_CHAIR_BACK', 68, 33);
  // Coffee Seating Tables
  addFurniture('COFFEE_TABLE', 63, 42);
  addFurniture('COFFEE', 63, 42);
  addFurniture('CUSHIONED_CHAIR_FRONT', 62, 43);
  addFurniture('CUSHIONED_CHAIR_FRONT', 65, 43);

  addFurniture('COFFEE_TABLE', 71, 42);
  addFurniture('COFFEE', 71, 42);
  addFurniture('CUSHIONED_CHAIR_FRONT', 70, 43);
  addFurniture('CUSHIONED_CHAIR_FRONT', 73, 43);

  addFurniture('SOFA_FRONT', 66, 48);
  addFurniture('LARGE_PLANT', 74, 49);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. 🏠 AGENT RESIDENCE & REST COMPLEX (Cols: 4..24, Rows: 54..58)
  // ─────────────────────────────────────────────────────────────────────────────
  fillRect(5, 55, 23, 58, 5 as TileType);
  for (let c = 4; c <= 24; c++) {
    setTile(c, 54, 0 as TileType);
  }
  setTile(14, 54, 5 as TileType); // Residence Door
  addFurniture('SOFA_FRONT', 8, 56);
  addFurniture('SOFA_FRONT', 18, 56);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. 🌳 CITY PARK (Cols: 28..52, Rows: 54..58)
  // ─────────────────────────────────────────────────────────────────────────────
  addFurniture('WOODEN_BENCH', 32, 55);
  addFurniture('WOODEN_BENCH', 44, 55);
  addFurniture('LARGE_PLANT', 30, 56);
  addFurniture('LARGE_PLANT', 47, 56);
  addFurniture('PLANT', 38, 57);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. 🖥️ SERVER CENTER & 🍽️ RESTAURANT (Cols: 56..76, Rows: 54..58)
  // ─────────────────────────────────────────────────────────────────────────────
  fillRect(57, 55, 75, 58, 8 as TileType);
  for (let c = 56; c <= 76; c++) {
    setTile(c, 54, 0 as TileType);
  }
  setTile(66, 54, 8 as TileType); // Door
  addFurniture('PC_SIDE', 60, 56);
  addFurniture('PC_SIDE', 70, 56);

  return {
    version: 1,
    cols,
    rows,
    layoutRevision: 15,
    tiles,
    carpetTiles,
    furniture,
  };
}
