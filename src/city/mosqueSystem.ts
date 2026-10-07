import { Direction } from '../office/types.js';

export type MosqueObjectType =
  | 'mosque_dome'
  | 'minaret'
  | 'mosque_gate'
  | 'prayer_hall'
  | 'prayer_carpet'
  | 'individual_prayer_mat'
  | 'quran_shelf'
  | 'quran_cabinet'
  | 'quran'
  | 'book_stand'
  | 'mihrab'
  | 'mimbar'
  | 'imam_prayer_mat'
  | 'mosque_clock'
  | 'calligraphy'
  | 'wall_lamp'
  | 'chandelier'
  | 'shoe_rack'
  | 'shoes'
  | 'ablution_area'
  | 'faucet'
  | 'water_drain'
  | 'bathroom'
  | 'mosque_entrance'
  | 'mosque_exit'
  | 'courtyard'
  | 'mosque_plant'
  | 'mosque_bench'
  | 'mosque_notice_board'
  | 'donation_box'
  | 'cleaning_cabinet'
  | 'broom'
  | 'mop'
  | 'bucket'
  | 'trash_bin';

export interface AblutionStation {
  id: string;
  col: number;
  row: number;
  faucet: boolean;
  drain: boolean;
  occupied: boolean;
  occupiedBy?: number | null;
  interactionDir: Direction;
}

export type WudhuPhase =
  | 'walk_to_sink'
  | 'sit'
  | 'wash_hands'
  | 'wash_mouth'
  | 'wash_nose'
  | 'wash_face'
  | 'wash_arms'
  | 'wipe_head'
  | 'wash_feet'
  | 'stand'
  | 'leave';

export interface PrayerMat {
  uid: string;
  col: number;
  row: number;
  occupied: boolean;
  direction: Direction;
  colorVariant: number;
  reservedFor?: number;
}

export interface QuranCabinet {
  uid: string;
  col: number;
  row: number;
  capacity: number;
  books: number;
  interactionDir: Direction;
}

export interface QuranBook {
  uid: string;
  cabinetUid: string;
  available: boolean;
  carriedBy?: number;
}

export interface ShoeRack {
  uid: string;
  col: number;
  row: number;
  capacity: number;
  storedShoes: Array<{ agentId: number; shoeType: string }>;
}

export class MosqueManager {
  // 1. Ablution (Tempat Wudhu) Stations
  ablutionStations: AblutionStation[] = [
    { id: 'wudhu_1', col: 45, row: 8, faucet: true, drain: true, occupied: false, interactionDir: Direction.LEFT },
    { id: 'wudhu_2', col: 45, row: 11, faucet: true, drain: true, occupied: false, interactionDir: Direction.LEFT },
    { id: 'wudhu_3', col: 45, row: 14, faucet: true, drain: true, occupied: false, interactionDir: Direction.LEFT },
    { id: 'wudhu_4', col: 45, row: 17, faucet: true, drain: true, occupied: false, interactionDir: Direction.LEFT },
    { id: 'wudhu_5', col: 45, row: 20, faucet: true, drain: true, occupied: false, interactionDir: Direction.LEFT },
  ];

  // 2. Individual Prayer Mats (Sajadah) in Prayer Hall
  prayerMats: PrayerMat[] = [
    // Mihrab / Imam
    { uid: 'mat_imam', col: 63, row: 5, occupied: false, direction: Direction.UP, colorVariant: 1 },
    // Shaf 1 (Row 8)
    { uid: 'mat_s1_1', col: 56, row: 8, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s1_2', col: 59, row: 8, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s1_3', col: 62, row: 8, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s1_4', col: 65, row: 8, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s1_5', col: 68, row: 8, occupied: false, direction: Direction.UP, colorVariant: 0 },
    // Shaf 2 (Row 11)
    { uid: 'mat_s2_1', col: 56, row: 11, occupied: false, direction: Direction.UP, colorVariant: 2 },
    { uid: 'mat_s2_2', col: 59, row: 11, occupied: false, direction: Direction.UP, colorVariant: 2 },
    { uid: 'mat_s2_3', col: 62, row: 11, occupied: false, direction: Direction.UP, colorVariant: 2 },
    { uid: 'mat_s2_4', col: 65, row: 11, occupied: false, direction: Direction.UP, colorVariant: 2 },
    { uid: 'mat_s2_5', col: 68, row: 11, occupied: false, direction: Direction.UP, colorVariant: 2 },
    // Shaf 3 (Row 14)
    { uid: 'mat_s3_1', col: 56, row: 14, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s3_2', col: 59, row: 14, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s3_3', col: 62, row: 14, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s3_4', col: 65, row: 14, occupied: false, direction: Direction.UP, colorVariant: 0 },
    { uid: 'mat_s3_5', col: 68, row: 14, occupied: false, direction: Direction.UP, colorVariant: 0 },
  ];

  // 3. Lemari & Rak Al-Qur'an
  quranCabinets: QuranCabinet[] = [
    { uid: 'quran_cab_1', col: 53, row: 3, capacity: 20, books: 15, interactionDir: Direction.DOWN },
    { uid: 'quran_cab_2', col: 73, row: 3, capacity: 20, books: 15, interactionDir: Direction.DOWN },
  ];

  quranBooks: QuranBook[] = [
    { uid: 'quran_1', cabinetUid: 'quran_cab_1', available: true },
    { uid: 'quran_2', cabinetUid: 'quran_cab_1', available: true },
    { uid: 'quran_3', cabinetUid: 'quran_cab_2', available: true },
    { uid: 'quran_4', cabinetUid: 'quran_cab_2', available: true },
  ];

  // 4. Rak Sepatu di Serambi Masuk
  shoeRacks: ShoeRack[] = [
    { uid: 'rack_west', col: 56, row: 24, capacity: 16, storedShoes: [] },
    { uid: 'rack_east', col: 62, row: 24, capacity: 16, storedShoes: [] },
  ];

  // 5. Kotak Amal
  donationBox = { col: 59, row: 23, totalInfaq: 1450000 };

  // 6. Lemari Kebersihan & Alat
  cleaningStation = { col: 44, row: 24, hasBroom: true, hasMop: true, hasBucket: true };

  /** Find an unoccupied prayer mat */
  findFreePrayerMat(): PrayerMat | null {
    return this.prayerMats.find((mat) => !mat.occupied && mat.uid !== 'mat_imam') ?? null;
  }

  /** Find an unoccupied ablution sink */
  findFreeAblutionStation(): AblutionStation | null {
    return this.ablutionStations.find((station) => !station.occupied) ?? null;
  }

  /** Take off shoes and store on rack */
  takeShoesOff(agentId: number): boolean {
    const rack = this.shoeRacks.find((r) => r.storedShoes.length < r.capacity);
    if (!rack) return false;
    rack.storedShoes.push({ agentId, shoeType: 'sepatu_kerja' });
    return true;
  }

  /** Retrieve shoes when leaving */
  putShoesOn(agentId: number): boolean {
    for (const rack of this.shoeRacks) {
      const idx = rack.storedShoes.findIndex((s) => s.agentId === agentId);
      if (idx !== -1) {
        rack.storedShoes.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /** Borrow a copy of the Holy Quran */
  borrowQuran(agentId: number): QuranBook | null {
    const book = this.quranBooks.find((b) => b.available);
    if (!book) return null;
    book.available = false;
    book.carriedBy = agentId;
    return book;
  }

  /** Return the Quran to the cabinet */
  returnQuran(agentId: number): boolean {
    const book = this.quranBooks.find((b) => b.carriedBy === agentId);
    if (!book) return false;
    book.available = true;
    book.carriedBy = undefined;
    return true;
  }

  /** Release all occupied spots after prayer */
  resetOccupancy() {
    for (const mat of this.prayerMats) {
      mat.occupied = false;
      mat.reservedFor = undefined;
    }
    for (const station of this.ablutionStations) {
      station.occupied = false;
      station.occupiedBy = null;
    }
  }
}

export const mosqueManager = new MosqueManager();
