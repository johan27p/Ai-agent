import { hqStore } from '../hq/hqStore.js';
import { CharacterState } from '../office/types.js';
import type { OfficeState } from '../office/engine/officeState.js';
import { adzanEventService } from './adzanService.js';

export interface AgentNeeds {
  energy: number; // 0 - 100
  hunger: number; // 0 - 100
  thirst: number; // 0 - 100
  social: number; // 0 - 100
  mood: number; // 0 - 100
  work: number; // 0 - 100
}

export interface AgentProfile {
  id: number;
  name: string;
  role: string;
  personality: 'pendiam_serius' | 'ramah_humoris' | 'sangat_teliti' | 'energik_aktif' | 'tenang_bijak';
  favDrink: string;
  favFood: string;
  habit: string;
  needs: AgentNeeds;
  currentAction: 'working' | 'drinking' | 'eating' | 'praying' | 'resting' | 'meeting' | 'cleaning';
  homeTile: { col: number; row: number };
}

export const AGENT_PROFILES: Record<number, AgentProfile> = {
  1: {
    id: 1,
    name: 'Alex',
    role: 'director',
    personality: 'tenang_bijak',
    favDrink: 'Espresso Double Shot',
    favFood: 'Steak Jamur Sehat',
    habit: 'Mengevaluasi arsitektur & sprint high-level',
    needs: { energy: 90, hunger: 85, thirst: 80, social: 85, mood: 90, work: 95 },
    currentAction: 'working',
    homeTile: { col: 9, row: 8 },
  },
  2: {
    id: 2,
    name: 'Sarah',
    role: 'manager',
    personality: 'energik_aktif',
    favDrink: 'Iced Matcha Latte',
    favFood: 'Salad Buah Segar',
    habit: 'Menyemangati tim & koordinasi task Jira',
    needs: { energy: 88, hunger: 80, thirst: 75, social: 90, mood: 88, work: 90 },
    currentAction: 'working',
    homeTile: { col: 26, row: 8 },
  },
  3: {
    id: 3,
    name: 'Devon',
    role: 'coder',
    personality: 'pendiam_serius',
    favDrink: 'Kopi Susu Gula Aren',
    favFood: 'Nasi Padang Rendang',
    habit: 'Menulis clean code & optimasi query',
    needs: { energy: 80, hunger: 70, thirst: 65, social: 60, mood: 85, work: 92 },
    currentAction: 'working',
    homeTile: { col: 8, row: 36 },
  },
  4: {
    id: 4,
    name: 'Tara',
    role: 'tester',
    personality: 'sangat_teliti',
    favDrink: 'Teh Chamomile Hangat',
    favFood: 'Soto Ayam Lamongan',
    habit: 'Mencari edge-case & automated test suite',
    needs: { energy: 85, hunger: 75, thirst: 70, social: 75, mood: 84, work: 88 },
    currentAction: 'working',
    homeTile: { col: 26, row: 36 },
  },
  5: {
    id: 5,
    name: 'Fikri',
    role: 'debugger',
    personality: 'ramah_humoris',
    favDrink: 'Iced Americano Dingin',
    favFood: 'Ayam Geprek Pedas',
    habit: 'Membongkar call stack & memory leak',
    needs: { energy: 82, hunger: 68, thirst: 60, social: 85, mood: 82, work: 90 },
    currentAction: 'working',
    homeTile: { col: 15, row: 36 },
  },
  6: {
    id: 6,
    name: 'Kenji',
    role: 'reviewer',
    personality: 'sangat_teliti',
    favDrink: 'Oolong Tea Panas',
    favFood: 'Gado-gado Komplit',
    habit: 'Audit keamanan pull request & refactoring',
    needs: { energy: 86, hunger: 82, thirst: 78, social: 70, mood: 88, work: 86 },
    currentAction: 'working',
    homeTile: { col: 8, row: 45 },
  },
  7: {
    id: 7,
    name: 'Farhan',
    role: 'security',
    personality: 'pendiam_serius',
    favDrink: 'Air Mineral Es',
    favFood: 'Roti Bakar Telur',
    habit: 'Memantau firewall & integritas server',
    needs: { energy: 92, hunger: 85, thirst: 82, social: 65, mood: 90, work: 94 },
    currentAction: 'working',
    homeTile: { col: 32, row: 36 },
  },
  8: {
    id: 8,
    name: 'Dr. Maya',
    role: 'researcher',
    personality: 'sangat_teliti',
    favDrink: 'Caramel Macchiato',
    favFood: 'Sandwich Gandum',
    habit: 'Membaca riset LLM di AI Library',
    needs: { energy: 78, hunger: 72, thirst: 68, social: 75, mood: 80, work: 88 },
    currentAction: 'working',
    homeTile: { col: 15, row: 45 },
  },
  9: {
    id: 9,
    name: 'Sami',
    role: 'janitor',
    personality: 'ramah_humoris',
    favDrink: 'Es Teh Manis Jumbo',
    favFood: 'Bakso Kuah Hangat',
    habit: 'Menyapu meja kantor, siram taman, rapikan masjid',
    needs: { energy: 85, hunger: 80, thirst: 75, social: 88, mood: 92, work: 90 },
    currentAction: 'cleaning',
    homeTile: { col: 19, row: 21 },
  },
  10: {
    id: 10,
    name: 'Rizal',
    role: 'maintenance',
    personality: 'energik_aktif',
    favDrink: 'Kopi Tubruk Hitam',
    favFood: 'Nasi Goreng Spesial',
    habit: 'Pengecekan pendingin server & thermal rack',
    needs: { energy: 89, hunger: 78, thirst: 72, social: 80, mood: 86, work: 92 },
    currentAction: 'working',
    homeTile: { col: 29, row: 45 },
  },
  11: {
    id: 11,
    name: 'Luna',
    role: 'barista',
    personality: 'ramah_humoris',
    favDrink: 'Vanilla Latte Art',
    favFood: 'Croissant Cokelat',
    habit: 'Meracik kopi nikmat di AI Café',
    needs: { energy: 95, hunger: 85, thirst: 90, social: 95, mood: 95, work: 90 },
    currentAction: 'working',
    homeTile: { col: 68, row: 33 },
  },
  12: {
    id: 12,
    name: 'Ustadz Zaid',
    role: 'imam',
    personality: 'tenang_bijak',
    favDrink: 'Teh Hijau Madu',
    favFood: 'Kurma & Nasi Kebuli',
    habit: 'Mengingatkan waktu salat & doa keberkahan',
    needs: { energy: 98, hunger: 90, thirst: 88, social: 90, mood: 98, work: 100 },
    currentAction: 'working',
    homeTile: { col: 63, row: 5 },
  },
};

// Landmarks in the Large 80x60 AI City
export const CITY_SPOTS = {
  masjid_wudhu: { col: 45, row: 14 },
  masjid_prayer: { col: 63, row: 8 },
  masjid_entrance: { col: 59, row: 26 },
  cafe_counter: { col: 68, row: 34 },
  cafe_lounge: { col: 65, row: 43 },
  restaurant_table: { col: 63, row: 43 },
  residence_bed: { col: 8, row: 56 },
  meeting_table: { col: 47, row: 40 },
  park_bench: { col: 32, row: 55 },
  server_rack: { col: 29, row: 45 },
};

class CityNeedsEngine {
  profiles = { ...AGENT_PROFILES };
  private officeStateRef: OfficeState | null = null;
  private isPrayerActive = false;

  setOfficeState(state: OfficeState) {
    this.officeStateRef = state;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      // Tick needs every 12 seconds
      setInterval(() => this.tickNeeds(), 12000);
    }
  }

  private tickNeeds() {
    if (this.isPrayerActive) return;

    for (const idStr of Object.keys(this.profiles)) {
      const id = Number(idStr);
      const p = this.profiles[id];
      if (!p) continue;

      // Natural depletion
      p.needs.thirst = Math.max(10, p.needs.thirst - (Math.floor(Math.random() * 3) + 1));
      p.needs.hunger = Math.max(15, p.needs.hunger - (Math.floor(Math.random() * 2) + 1));
      p.needs.energy = Math.max(20, p.needs.energy - (Math.floor(Math.random() * 2) + 1));

      // Autonomous Decisions
      if (p.currentAction === 'working') {
        // 1. Thirst trigger -> go to AI Café
        if (p.needs.thirst < 35 && Math.random() < 0.35) {
          this.triggerAgentDrink(p);
        }
        // 2. Hunger trigger -> go to Restaurant
        else if (p.needs.hunger < 30 && Math.random() < 0.3) {
          this.triggerAgentEat(p);
        }
        // 3. Energy low -> go to Residence
        else if (p.needs.energy < 25 && Math.random() < 0.3) {
          this.triggerAgentRest(p);
        }
      }
    }
  }

  /** Agent goes to AI Café to get their favorite drink */
  triggerAgentDrink(p: AgentProfile) {
    p.currentAction = 'drinking';
    hqStore.sendMessage(
      'operations',
      `${p.name}: "Tenggorokan kering nih, mau pesan ${p.favDrink} dulu di AI Café."`,
      p.role as any,
      p.id,
    );

    if (this.officeStateRef) {
      this.officeStateRef.walkToTile(p.id, CITY_SPOTS.cafe_counter.col, CITY_SPOTS.cafe_counter.row);
      setTimeout(() => {
        const ch = this.officeStateRef?.characters.get(p.id);
        if (ch) ch.state = CharacterState.COFFEE;
      }, 3500);
    }

    // After 9 seconds, drink recovered -> return to desk
    setTimeout(() => {
      p.needs.thirst = 100;
      p.needs.energy = Math.min(100, p.needs.energy + 15);
      p.currentAction = 'working';
      if (this.officeStateRef) {
        this.officeStateRef.walkToTile(p.id, p.homeTile.col, p.homeTile.row);
        setTimeout(() => {
          const ch = this.officeStateRef?.characters.get(p.id);
          if (ch) ch.state = CharacterState.TYPE;
        }, 3500);
      }
    }, 10000);
  }

  /** Agent goes to Restaurant to eat */
  triggerAgentEat(p: AgentProfile) {
    p.currentAction = 'eating';
    hqStore.sendMessage(
      'operations',
      `${p.name}: "Sudah lapar, saya ke Restaurant makan ${p.favFood} sebentar ya."`,
      p.role as any,
      p.id,
    );

    if (this.officeStateRef) {
      this.officeStateRef.walkToTile(p.id, CITY_SPOTS.restaurant_table.col, CITY_SPOTS.restaurant_table.row);
      setTimeout(() => {
        const ch = this.officeStateRef?.characters.get(p.id);
        if (ch) ch.state = CharacterState.EAT;
      }, 3500);
    }

    setTimeout(() => {
      p.needs.hunger = 100;
      p.needs.energy = Math.min(100, p.needs.energy + 20);
      p.currentAction = 'working';
      if (this.officeStateRef) {
        this.officeStateRef.walkToTile(p.id, p.homeTile.col, p.homeTile.row);
        setTimeout(() => {
          const ch = this.officeStateRef?.characters.get(p.id);
          if (ch) ch.state = CharacterState.TYPE;
        }, 3500);
      }
    }, 11000);
  }

  /** Agent goes to Residence to rest/sleep */
  triggerAgentRest(p: AgentProfile) {
    p.currentAction = 'resting';
    hqStore.sendMessage(
      'operations',
      `${p.name}: "Mata lelah banget, mau istirahat rebahan sejenak di Residence."`,
      p.role as any,
      p.id,
    );

    if (this.officeStateRef) {
      this.officeStateRef.walkToTile(p.id, CITY_SPOTS.residence_bed.col, CITY_SPOTS.residence_bed.row);
      setTimeout(() => {
        const ch = this.officeStateRef?.characters.get(p.id);
        if (ch) ch.state = CharacterState.SLEEP;
      }, 3500);
    }

    setTimeout(() => {
      p.needs.energy = 95;
      p.currentAction = 'working';
      if (this.officeStateRef) {
        this.officeStateRef.walkToTile(p.id, p.homeTile.col, p.homeTile.row);
        setTimeout(() => {
          const ch = this.officeStateRef?.characters.get(p.id);
          if (ch) ch.state = CharacterState.TYPE;
        }, 3500);
      }
    }, 12000);
  }

  /** Trigger Call to Prayer */
  triggerPrayerTime() {
    adzanEventService.triggerAdzanEvent();
  }

  /** Trigger Meeting Call by Manager */
  triggerTeamMeeting() {
    hqStore.sendMessage(
      'engineering',
      'Sarah (Manager): "Tim engineering (Devon, Tara, Fikri, Kenji), kita meeting lima menit di Meeting Center untuk review sprint."',
      'manager',
      2,
    );

    const attendees = [2, 3, 4, 5, 6];
    for (const id of attendees) {
      const p = this.profiles[id];
      if (!p) continue;
      p.currentAction = 'meeting';
      if (this.officeStateRef) {
        this.officeStateRef.walkToTile(id, CITY_SPOTS.meeting_table.col, CITY_SPOTS.meeting_table.row);
        setTimeout(() => {
          const ch = this.officeStateRef?.characters.get(id);
          if (ch) ch.state = CharacterState.MEETING;
        }, 3500);
      }
    }

    setTimeout(() => {
      hqStore.sendMessage(
        'engineering',
        'Devon: "Modul auth dan validasi transaksi sudah lolos automated test. Siap di-merge."',
        'coder',
        3,
      );
    }, 5000);

    setTimeout(() => {
      hqStore.sendMessage(
        'engineering',
        'Sarah: "Bagus! Meeting selesai. Silakan kembali ke workstation masing-masing."',
        'manager',
        2,
      );
      for (const id of attendees) {
        const p = this.profiles[id];
        if (!p) continue;
        p.currentAction = 'working';
        if (this.officeStateRef) {
          this.officeStateRef.walkToTile(id, p.homeTile.col, p.homeTile.row);
          setTimeout(() => {
            const ch = this.officeStateRef?.characters.get(id);
            if (ch) ch.state = CharacterState.TYPE;
          }, 3500);
        }
      }
    }, 12000);
  }
}

export const cityNeedsEngine = new CityNeedsEngine();
