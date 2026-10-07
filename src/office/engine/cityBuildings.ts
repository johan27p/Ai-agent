import type { AIPlace } from './aiLife.js';

export type BuildingType =
  | 'HQ'
  | 'OFFICE'
  | 'CAFE'
  | 'RESTAURANT'
  | 'SHOP'
  | 'MOSQUE'
  | 'PARK'
  | 'RESIDENCE'
  | 'HOSPITAL'
  | 'SERVER'
  | 'MEETING'
  | 'LIBRARY'
  | 'MAINTENANCE';

export interface CityTile {
  col: number;
  row: number;
}

export interface BuildingRoom {
  id: string;
  name: string;
  tiles: CityTile[];
  activities: string[];
}

export interface CityBuilding {
  id: string;
  name: string;
  type: BuildingType;

  x: number;
  y: number;

  width: number;
  height: number;

  entrance: CityTile;
  exits: CityTile[];

  rooms: BuildingRoom[];

  capacity: number;

  place: AIPlace;

  exterior: {
    walls: boolean;
    roof: boolean;
    windows: boolean;
    door: boolean;
  };
}

function room(
  id: string,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  activities: string[],
): BuildingRoom {
  const tiles: CityTile[] = [];

  for (let row = y; row < y + height; row++) {
    for (let col = x; col < x + width; col++) {
      tiles.push({ col, row });
    }
  }

  return {
    id,
    name,
    tiles,
    activities,
  };
}

export function createCityBuildings(): CityBuilding[] {
  return [
    {
      id: 'ai-hq',
      name: 'AI Headquarters',
      type: 'HQ',
      x: 10,
      y: 6,
      width: 18,
      height: 12,
      entrance: { col: 19, row: 18 },
      exits: [{ col: 19, row: 18 }],
      capacity: 100,
      place: 'OFFICE',

      rooms: [
        room(
          'hq-main',
          'Main Office',
          11,
          7,
          16,
          6,
          ['WORK', 'TYPE', 'READ'],
        ),
        room(
          'hq-meeting',
          'Meeting Room',
          12,
          14,
          7,
          3,
          ['MEETING'],
        ),
        room(
          'hq-director',
          'Director Office',
          20,
          14,
          6,
          3,
          ['WORK', 'MEETING'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'coding-lab',
      name: 'AI Coding Lab',
      type: 'OFFICE',
      x: 32,
      y: 7,
      width: 14,
      height: 9,
      entrance: { col: 39, row: 16 },
      exits: [{ col: 39, row: 16 }],
      capacity: 40,
      place: 'OFFICE',

      rooms: [
        room(
          'coding-main',
          'Coding Floor',
          33,
          8,
          12,
          7,
          ['WORK', 'TYPE', 'DEBUG'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'server-center',
      name: 'AI Server Center',
      type: 'SERVER',
      x: 50,
      y: 7,
      width: 12,
      height: 10,
      entrance: { col: 56, row: 17 },
      exits: [{ col: 56, row: 17 }],
      capacity: 20,
      place: 'SERVER',

      rooms: [
        room(
          'server-room',
          'Server Room',
          51,
          8,
          10,
          8,
          ['MONITOR', 'MAINTENANCE'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: false,
        door: true,
      },
    },

    {
      id: 'cafe',
      name: 'AI City Coffee',
      type: 'CAFE',
      x: 10,
      y: 24,
      width: 12,
      height: 8,
      entrance: { col: 16, row: 32 },
      exits: [{ col: 16, row: 32 }],
      capacity: 30,
      place: 'CAFE',

      rooms: [
        room(
          'cafe-main',
          'Coffee Area',
          11,
          25,
          10,
          6,
          ['COFFEE', 'DRINK', 'TALK', 'REST'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'restaurant',
      name: 'AI City Restaurant',
      type: 'RESTAURANT',
      x: 25,
      y: 24,
      width: 14,
      height: 9,
      entrance: { col: 32, row: 33 },
      exits: [{ col: 32, row: 33 }],
      capacity: 50,
      place: 'RESTAURANT',

      rooms: [
        room(
          'restaurant-main',
          'Dining Hall',
          26,
          25,
          12,
          7,
          ['EAT', 'TALK', 'REST'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'shop',
      name: 'AI City Market',
      type: 'SHOP',
      x: 42,
      y: 24,
      width: 12,
      height: 9,
      entrance: { col: 48, row: 33 },
      exits: [{ col: 48, row: 33 }],
      capacity: 35,
      place: 'SHOP',

      rooms: [
        room(
          'shop-main',
          'Market',
          43,
          25,
          10,
          7,
          ['SHOP', 'BUY'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'residence',
      name: 'AI Residence',
      type: 'RESIDENCE',
      x: 58,
      y: 23,
      width: 14,
      height: 11,
      entrance: { col: 65, row: 34 },
      exits: [{ col: 65, row: 34 }],
      capacity: 50,
      place: 'RESIDENCE',

      rooms: [
        room(
          'residence-bedrooms',
          'Bedrooms',
          59,
          24,
          12,
          6,
          ['SLEEP', 'REST'],
        ),
        room(
          'residence-common',
          'Common Room',
          59,
          30,
          12,
          3,
          ['TALK', 'REST'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },

    {
      id: 'park',
      name: 'AI City Park',
      type: 'PARK',
      x: 10,
      y: 38,
      width: 24,
      height: 14,
      entrance: { col: 22, row: 38 },
      exits: [{ col: 22, row: 38 }],
      capacity: 100,
      place: 'PARK',

      rooms: [
        room(
          'park-main',
          'City Park',
          11,
          39,
          22,
          12,
          ['WALK', 'REST', 'TALK'],
        ),
      ],

      exterior: {
        walls: false,
        roof: false,
        windows: false,
        door: false,
      },
    },

    {
      id: 'mosque',
      name: 'Masjid AI City',
      type: 'MOSQUE',
      x: 39,
      y: 38,
      width: 28,
      height: 18,
      entrance: { col: 53, row: 56 },
      exits: [
        { col: 53, row: 56 },
        { col: 39, row: 47 },
        { col: 67, row: 47 },
      ],
      capacity: 250,
      place: 'MOSQUE',

      rooms: [
        room(
          'mosque-courtyard',
          'Courtyard',
          40,
          39,
          26,
          4,
          ['WALK', 'WAIT'],
        ),

        room(
          'mosque-wudu',
          'Tempat Wudu',
          40,
          44,
          7,
          7,
          ['WUDHU'],
        ),

        room(
          'mosque-prayer',
          'Ruang Salat',
          48,
          44,
          17,
          10,
          ['PRAY'],
        ),

        room(
          'mosque-mihrab',
          'Mihrab dan Mimbar',
          52,
          44,
          8,
          3,
          ['PRAY'],
        ),

        room(
          'mosque-parking',
          'Parkir',
          42,
          52,
          22,
          3,
          ['PARK'],
        ),
      ],

      exterior: {
        walls: true,
        roof: true,
        windows: true,
        door: true,
      },
    },
  ];
}

export function findBuilding(
  buildings: CityBuilding[],
  place: AIPlace,
): CityBuilding | undefined {
  return buildings.find(building => building.place === place);
}
