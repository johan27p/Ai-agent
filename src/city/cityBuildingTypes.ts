export type BuildingType =
  | 'office'
  | 'command'
  | 'coding'
  | 'testing'
  | 'debugging'
  | 'server'
  | 'meeting'
  | 'mosque'
  | 'cafe'
  | 'restaurant'
  | 'shop'
  | 'residence'
  | 'hospital'
  | 'research'
  | 'maintenance'
  | 'park';

export interface TilePosition {
  col: number;
  row: number;
}

export interface BuildingActivitySpot {
  id: string;
  label: string;
  col: number;
  row: number;
  activity: string;
  occupiedBy?: number | null;
}

export interface BuildingRoom {
  id: string;
  name: string;
  bounds: { minCol: number; maxCol: number; minRow: number; maxRow: number };
  entrance: TilePosition;
  activities: string[];
  spots: BuildingActivitySpot[];
}

export interface CityBuilding {
  id: string;
  name: string;
  type: BuildingType;
  width: number;
  height: number;
  x: number;
  y: number;
  entrance: TilePosition;
  exits: TilePosition[];
  rooms: BuildingRoom[];
  walkableTiles: TilePosition[];
  blockedTiles: TilePosition[];
  activities: string[];
  capacity: number;
}

export interface AIPersonality {
  traits: string[];
  talkativeness: number; // 0 - 100
  humor: number; // 0 - 100
  friendliness: number; // 0 - 100
  seriousness: number; // 0 - 100
  curiosity: number; // 0 - 100
  coffeePreference: string;
  foodPreference: string;
}

export interface AILifeState {
  agentId: number;
  hunger: number; // 0 - 100
  thirst: number; // 0 - 100
  energy: number; // 0 - 100
  social: number; // 0 - 100
  mood: number; // 0 - 100

  personality: AIPersonality;

  currentActivity: string;
  currentBuilding: string | null;
  destinationBuilding: string | null;

  lastConversationAt: number;
  lastActivityAt: number;
}
