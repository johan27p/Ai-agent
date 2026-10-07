import type { CityBuilding, BuildingType, TilePosition, BuildingActivitySpot } from './cityBuildingTypes.js';

class BuildingManager {
  private buildings: Map<string, CityBuilding> = new Map();
  private agentBuildingMap: Map<number, string> = new Map();

  constructor() {
    this.registerDefaultCityBuildings();
  }

  private registerDefaultCityBuildings() {
    // 1. 🕌 MASJID AI CITY (Landmark! 36 x 24 tiles)
    this.registerBuilding({
      id: 'masjid',
      name: 'Masjid AI City',
      type: 'mosque',
      width: 36,
      height: 24,
      x: 42,
      y: 2,
      entrance: { col: 59, row: 26 },
      exits: [{ col: 59, row: 26 }, { col: 60, row: 26 }],
      rooms: [
        {
          id: 'prayer_hall',
          name: 'Ruang Salat Utama',
          bounds: { minCol: 50, maxCol: 76, minRow: 3, maxRow: 25 },
          entrance: { col: 59, row: 25 },
          activities: ['sholat_berjamaah', 'dzikir', 'doa', 'kajian'],
          spots: [
            { id: 'imam_mihrab', label: 'Mihrab Imam', col: 63, row: 5, activity: 'imam' },
            { id: 'shaf1_1', label: 'Shaf 1 - Posisi 1', col: 58, row: 8, activity: 'makmum' },
            { id: 'shaf1_2', label: 'Shaf 1 - Posisi 2', col: 61, row: 8, activity: 'makmum' },
            { id: 'shaf1_3', label: 'Shaf 1 - Posisi 3', col: 64, row: 8, activity: 'makmum' },
            { id: 'shaf1_4', label: 'Shaf 1 - Posisi 4', col: 67, row: 8, activity: 'makmum' },
            { id: 'shaf2_1', label: 'Shaf 2 - Posisi 1', col: 58, row: 11, activity: 'makmum' },
            { id: 'shaf2_2', label: 'Shaf 2 - Posisi 2', col: 61, row: 11, activity: 'makmum' },
            { id: 'shaf2_3', label: 'Shaf 2 - Posisi 3', col: 64, row: 11, activity: 'makmum' },
            { id: 'shaf2_4', label: 'Shaf 2 - Posisi 4', col: 67, row: 11, activity: 'makmum' },
          ],
        },
        {
          id: 'wudhu_area',
          name: 'Tempat Wudu & Bersuci',
          bounds: { minCol: 43, maxCol: 48, minRow: 3, maxRow: 25 },
          entrance: { col: 49, row: 14 },
          activities: ['wudhu', 'bersuci'],
          spots: [
            { id: 'wudhu_tap_1', label: 'Kran Wudu 1', col: 45, row: 8, activity: 'wudhu' },
            { id: 'wudhu_tap_2', label: 'Kran Wudu 2', col: 45, row: 12, activity: 'wudhu' },
            { id: 'wudhu_tap_3', label: 'Kran Wudu 3', col: 45, row: 16, activity: 'wudhu' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['wudhu', 'sholat_berjamaah', 'doa', 'istirahat_rohani'],
      capacity: 40,
    });

    // 2. 🏢 AI HEADQUARTERS & COMMAND CENTER (34 x 24 tiles)
    this.registerBuilding({
      id: 'hq',
      name: 'AI Headquarters & Command Center',
      type: 'office',
      width: 34,
      height: 24,
      x: 3,
      y: 2,
      entrance: { col: 19, row: 26 },
      exits: [{ col: 19, row: 26 }, { col: 20, row: 26 }],
      rooms: [
        {
          id: 'director_office',
          name: 'Kantor AI Director',
          bounds: { minCol: 4, maxCol: 18, minRow: 3, maxRow: 13 },
          entrance: { col: 19, row: 8 },
          activities: ['executive_strategy', 'sprint_approval'],
          spots: [
            { id: 'alex_desk', label: 'Meja Director Alex', col: 9, row: 8, activity: 'lead' },
          ],
        },
        {
          id: 'manager_office',
          name: 'Command Center & Manager',
          bounds: { minCol: 20, maxCol: 36, minRow: 3, maxRow: 13 },
          entrance: { col: 19, row: 8 },
          activities: ['team_monitoring', 'task_dispatch'],
          spots: [
            { id: 'sarah_desk', label: 'Meja Manager Sarah', col: 26, row: 8, activity: 'manage' },
          ],
        },
        {
          id: 'hq_lobby',
          name: 'Lobby & Reception Area',
          bounds: { minCol: 4, maxCol: 36, minRow: 15, maxRow: 25 },
          entrance: { col: 19, row: 25 },
          activities: ['welcome', 'waiting', 'security_check'],
          spots: [
            { id: 'reception_desk', label: 'Meja Resepsionis', col: 19, row: 21, activity: 'reception' },
            { id: 'lobby_sofa_1', label: 'Sofa Lobby Kiri', col: 8, row: 21, activity: 'rest' },
            { id: 'lobby_sofa_2', label: 'Sofa Lobby Kanan', col: 28, row: 21, activity: 'rest' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['executive_strategy', 'team_monitoring', 'sprint_approval'],
      capacity: 25,
    });

    // 3. 💻 CODING LAB & 🧪 TESTING LAB (34 x 22 tiles)
    this.registerBuilding({
      id: 'dev_center',
      name: 'Coding & Testing Center',
      type: 'coding',
      width: 34,
      height: 22,
      x: 3,
      y: 30,
      entrance: { col: 19, row: 30 },
      exits: [{ col: 19, row: 30 }, { col: 19, row: 52 }],
      rooms: [
        {
          id: 'coding_lab',
          name: 'Coding Lab',
          bounds: { minCol: 4, maxCol: 19, minRow: 31, maxRow: 51 },
          entrance: { col: 19, row: 31 },
          activities: ['coding', 'code_review', 'refactoring'],
          spots: [
            { id: 'devon_desk', label: 'Meja Coder Devon', col: 8, row: 36, activity: 'coding' },
            { id: 'fikri_desk', label: 'Meja Debugger Fikri', col: 15, row: 36, activity: 'debugging' },
            { id: 'kenji_desk', label: 'Meja Reviewer Kenji', col: 8, row: 45, activity: 'review' },
            { id: 'maya_desk', label: 'Meja Riset Dr. Maya', col: 15, row: 45, activity: 'research' },
          ],
        },
        {
          id: 'testing_lab',
          name: 'Testing & QA Lab',
          bounds: { minCol: 21, maxCol: 36, minRow: 31, maxRow: 51 },
          entrance: { col: 20, row: 41 },
          activities: ['automated_testing', 'integration_test', 'security_audit'],
          spots: [
            { id: 'tara_desk', label: 'Meja Tester Tara', col: 26, row: 36, activity: 'testing' },
            { id: 'farhan_desk', label: 'Meja Security Farhan', col: 32, row: 36, activity: 'security' },
            { id: 'auto_rig_desk', label: 'Terminal Automation Rig', col: 29, row: 45, activity: 'automation' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['coding', 'debugging', 'testing', 'automation'],
      capacity: 20,
    });

    // 4. 🤝 MEETING CENTER & ☕ AI CAFÉ (36 x 22 tiles)
    this.registerBuilding({
      id: 'meeting_cafe',
      name: 'Meeting Center & AI Café',
      type: 'meeting',
      width: 36,
      height: 22,
      x: 42,
      y: 30,
      entrance: { col: 59, row: 30 },
      exits: [{ col: 59, row: 30 }, { col: 59, row: 52 }],
      rooms: [
        {
          id: 'conference_room',
          name: 'Conference & Meeting Hall',
          bounds: { minCol: 43, maxCol: 57, minRow: 31, maxRow: 51 },
          entrance: { col: 58, row: 41 },
          activities: ['meeting', 'sprint_planning', 'brainstorming'],
          spots: [
            { id: 'conf_chair_1', label: 'Kursi Konferensi 1', col: 47, row: 40, activity: 'meeting' },
            { id: 'conf_chair_2', label: 'Kursi Konferensi 2', col: 51, row: 40, activity: 'meeting' },
            { id: 'conf_chair_3', label: 'Kursi Konferensi 3', col: 47, row: 43, activity: 'meeting' },
            { id: 'conf_chair_4', label: 'Kursi Konferensi 4', col: 51, row: 43, activity: 'meeting' },
          ],
        },
        {
          id: 'ai_cafe',
          name: 'AI Café Lounge',
          bounds: { minCol: 59, maxCol: 76, minRow: 31, maxRow: 51 },
          entrance: { col: 59, row: 31 },
          activities: ['coffee', 'drinking', 'snack', 'social'],
          spots: [
            { id: 'luna_barista', label: 'Counter Barista Luna', col: 68, row: 33, activity: 'barista' },
            { id: 'cafe_table_1', label: 'Meja Kopi 1', col: 62, row: 43, activity: 'drink' },
            { id: 'cafe_table_2', label: 'Meja Kopi 2', col: 65, row: 43, activity: 'drink' },
            { id: 'cafe_table_3', label: 'Meja Kopi 3', col: 70, row: 43, activity: 'drink' },
            { id: 'cafe_sofa', label: 'Sofa Santai Café', col: 66, row: 48, activity: 'rest' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['meeting', 'coffee', 'social'],
      capacity: 30,
    });

    // 5. 🏠 AGENT RESIDENCE (22 x 6 tiles)
    this.registerBuilding({
      id: 'residence',
      name: 'Agent Residence Complex',
      type: 'residence',
      width: 22,
      height: 6,
      x: 3,
      y: 53,
      entrance: { col: 14, row: 54 },
      exits: [{ col: 14, row: 54 }],
      rooms: [
        {
          id: 'rest_pods',
          name: 'Kamar & Pod Tidur',
          bounds: { minCol: 4, maxCol: 24, minRow: 54, maxRow: 58 },
          entrance: { col: 14, row: 54 },
          activities: ['sleep', 'rest', 'night_recovery'],
          spots: [
            { id: 'bed_pod_1', label: 'Pod Istirahat 1', col: 8, row: 56, activity: 'sleep' },
            { id: 'bed_pod_2', label: 'Pod Istirahat 2', col: 18, row: 56, activity: 'sleep' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['sleep', 'rest'],
      capacity: 12,
    });

    // 6. 🌳 CITY PARK (26 x 6 tiles)
    this.registerBuilding({
      id: 'park',
      name: 'City Park & Green Garden',
      type: 'park',
      width: 26,
      height: 6,
      x: 27,
      y: 53,
      entrance: { col: 38, row: 54 },
      exits: [{ col: 38, row: 54 }],
      rooms: [
        {
          id: 'garden_area',
          name: 'Taman Terbuka',
          bounds: { minCol: 28, maxCol: 52, minRow: 54, maxRow: 58 },
          entrance: { col: 38, row: 54 },
          activities: ['walk', 'relax', 'nature'],
          spots: [
            { id: 'park_bench_1', label: 'Bangku Taman Kiri', col: 32, row: 55, activity: 'rest' },
            { id: 'park_bench_2', label: 'Bangku Taman Kanan', col: 44, row: 55, activity: 'rest' },
          ],
        },
      ],
      walkableTiles: [],
      blockedTiles: [],
      activities: ['walk', 'relax'],
      capacity: 20,
    });
  }

  registerBuilding(building: CityBuilding) {
    this.buildings.set(building.id, building);
  }

  getBuilding(id: string): CityBuilding | undefined {
    return this.buildings.get(id);
  }

  getAllBuildings(): CityBuilding[] {
    return Array.from(this.buildings.values());
  }

  getEntrance(buildingId: string): TilePosition {
    const b = this.buildings.get(buildingId);
    return b ? b.entrance : { col: 38, row: 28 };
  }

  findSpotForActivity(buildingId: string, activityName: string): BuildingActivitySpot | null {
    const b = this.buildings.get(buildingId);
    if (!b) return null;

    for (const room of b.rooms) {
      for (const spot of room.spots) {
        if (spot.activity === activityName || spot.id.includes(activityName)) {
          return spot;
        }
      }
    }
    // Fallback to room first spot
    return b.rooms[0]?.spots[0] || null;
  }
}

export const buildingManager = new BuildingManager();
