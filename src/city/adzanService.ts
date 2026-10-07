import { hqStore } from '../hq/hqStore.js';
import { CharacterState, Direction } from '../office/types.js';
import type { OfficeState } from '../office/engine/officeState.js';
import { mosqueManager } from './mosqueSystem.js';

export interface PrayerTimeSlot {
  name: string;
  hour: number;
  minute: number;
}

export interface AdzanState {
  isActive: boolean;
  prayerName: string;
  step: 'adzan' | 'checkpoint' | 'wudhu' | 'salat' | 'doa' | 'selesai';
  countdownSeconds: number;
  timezone: string;
}

class AdzanEventService {
  private officeState: OfficeState | null = null;
  private state: AdzanState = {
    isActive: false,
    prayerName: 'Dzuhur',
    step: 'selesai',
    countdownSeconds: 0,
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Asia/Jakarta',
  };

  private listeners = new Set<(state: AdzanState) => void>();
  private prayerInterval: ReturnType<typeof setInterval> | null = null;
  private stepTimeout: ReturnType<typeof setTimeout>[] = [];

  // Home seats for returning after prayer in the Large AI City
  private agentOriginalDesks: Record<number, { col: number; row: number }> = {
    1: { col: 9, row: 8 },    // Alex (Director Office)
    2: { col: 26, row: 8 },   // Sarah (Manager Office)
    3: { col: 8, row: 36 },   // Devon (Coding Lab)
    4: { col: 26, row: 36 },  // Tara (Testing Lab)
    5: { col: 15, row: 36 },  // Fikri (Debugging Station)
    6: { col: 8, row: 45 },   // Kenji (Reviewer Desk)
    7: { col: 32, row: 36 },  // Farhan (Security Desk)
    8: { col: 15, row: 45 },  // Dr. Maya (Research Desk)
    9: { col: 19, row: 21 },  // Sami (HQ Reception & Lobby)
    10: { col: 29, row: 45 }, // Rizal (Automation Station)
    11: { col: 68, row: 33 }, // Luna (AI Café Barista Counter)
    12: { col: 63, row: 5 },  // Ustadz Zaid (Masjid AI City Mihrab)
  };

  // Congregation spots in the grand MASJID AI CITY (36 x 24 tiles)
  private masjidPrayerPositions: Record<number, { col: number; row: number }> = {
    12: { col: 63, row: 5 },  // Ustadz Zaid (Imam at Mihrab)
    1: { col: 58, row: 8 },   // Alex (Shaf 1)
    3: { col: 61, row: 8 },   // Devon (Shaf 1)
    5: { col: 64, row: 8 },   // Fikri (Shaf 1)
    6: { col: 67, row: 8 },   // Kenji (Shaf 1)
    2: { col: 58, row: 11 },  // Sarah (Shaf 2)
    4: { col: 61, row: 11 },  // Tara (Shaf 2)
    8: { col: 64, row: 11 },  // Dr. Maya (Shaf 2)
    7: { col: 67, row: 11 },  // Farhan (Shaf 2)
    9: { col: 45, row: 10 },  // Sami (Wudhu Area)
    10: { col: 45, row: 14 }, // Rizal (Wudhu Area)
    11: { col: 45, row: 18 }, // Luna (Wudhu Area)
  };

  constructor() {
    if (typeof window !== 'undefined') {
      // Check real-time clock every 10 seconds for prayer arrival
      this.prayerInterval = setInterval(() => this.checkRealtimePrayer(), 10000);
    }
  }

  setOfficeState(state: OfficeState) {
    this.officeState = state;
  }

  subscribe(listener: (state: AdzanState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  getState(): AdzanState {
    return { ...this.state };
  }

  /**
   * Play gentle harmonic chime / audio cue using Web Audio API
   */
  private playAdzanChime() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Gentle Islamic prayer bell / chime harmonic chord (F# - A# - C#)
      const frequencies = [370, 466, 554, 740];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.12 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 2.6);
      });
    } catch {
      // Audio autoplay policy guard
    }
  }

  /**
   * Monitors real-time clock to trigger Adzan automatically
   */
  private checkRealtimePrayer() {
    if (this.state.isActive) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Standard prayer schedule
    const schedule: PrayerTimeSlot[] = [
      { name: 'Subuh', hour: 4, minute: 35 },
      { name: 'Dzuhur', hour: 12, minute: 5 },
      { name: 'Ashar', hour: 15, minute: 15 },
      { name: 'Maghrib', hour: 18, minute: 0 },
      { name: 'Isya', hour: 19, minute: 15 },
    ];

    for (const slot of schedule) {
      if (hours === slot.hour && minutes === slot.minute) {
        this.triggerAdzanEvent(slot.name);
        break;
      }
    }
  }

  /**
   * TRIGGER ADZAN EVENT:
   * 1. Plays gentle chime
   * 2. Sets all AI agents' currentActivity to "🕌 Sedang Salat"
   * 3. Dispatches safe checkpoint remark
   * 4. Animates agents moving to MASJID AI CITY
   * 5. Conducts prayer on sajadah
   * 6. Concludes and walks agents back
   */
  triggerAdzanEvent(prayerName = 'Dzuhur') {
    // Clear any previous ongoing sequence
    for (const t of this.stepTimeout) clearTimeout(t);
    this.stepTimeout = [];

    this.state = {
      isActive: true,
      prayerName,
      step: 'adzan',
      countdownSeconds: 18,
      timezone: this.state.timezone,
    };
    this.notify();

    this.playAdzanChime();

    // STEP 1: ADZAN ANNOUNCEMENT
    hqStore.sendMessage(
      'prayer-spiritual',
      `📢 [ADZAN BERKUMANDANG] Waktu salat ${prayerName} telah tiba (${this.state.timezone}). "Allahu Akbar, Allahu Akbar..." Marilah menunaikan salat berjamaah di MASJID AI CITY.`,
      'imam',
      12,
    );

    // Update ALL agents' currentActivity to 🕌 Sedang Salat
    for (const agent of hqStore.agents) {
      agent.currentActivity = '🕌 Sedang Salat';
      agent.currentRoutine = 'praying';
      agent.location = 'Masjid';
      agent.mood = 'peaceful';
    }
    hqStore.notify();

    // STEP 2: SAFE CHECKPOINT (2 seconds)
    const t1 = setTimeout(() => {
      this.state.step = 'checkpoint';
      this.notify();

      hqStore.sendMessage(
        'engineering',
        'Devon: "Sebentar, saya simpan progresnya dulu (git commit safe checkpoint). Sudah masuk waktu salat."',
        'coder',
        3,
      );
      hqStore.sendMessage(
        'announcements',
        'Alex (AI Director): "Tim AI City, mari kita jeda sejenak dan menuju Masjid AI City untuk salat berjamaah."',
        'director',
        1,
      );
    }, 2000);
    this.stepTimeout.push(t1);

    // STEP 3: ANIMATE MOVEMENT TO MASJID & WUDHU (3.5 seconds)
    const t2 = setTimeout(() => {
      this.state.step = 'wudhu';
      this.notify();

      if (this.officeState) {
        // Pathfind each agent into Masjid AI City, take shoes off, do wudhu
        Object.entries(this.masjidPrayerPositions).forEach(([idStr, pos], idx) => {
          const agentId = Number(idStr);
          mosqueManager.takeShoesOff(agentId);
          setTimeout(() => {
            this.officeState?.walkToTile(agentId, pos.col, pos.row);
            setTimeout(() => {
              const ch = this.officeState?.characters.get(agentId);
              if (ch) ch.state = CharacterState.WUDHU;
            }, 2600);
          }, idx * 180);
        });
      }
    }, 3800);
    this.stepTimeout.push(t2);

    // STEP 4: SALAT BERJAMA'AH IN MASJID (8 seconds)
    const t3 = setTimeout(() => {
      this.state.step = 'salat';
      this.notify();

      if (this.officeState) {
        for (const [idStr] of Object.entries(this.masjidPrayerPositions)) {
          const agentId = Number(idStr);
          const ch = this.officeState.characters.get(agentId);
          if (ch) {
            ch.state = CharacterState.PRAY;
            ch.dir = Direction.UP; // Facing kiblat / Mihrab
          }
        }
      }

      hqStore.sendMessage(
        'prayer-spiritual',
        'Ustadz Zaid: "Istawuu wa’tadiluu... Rapatkan dan luruskan shaf salat berjamaah."',
        'imam',
        12,
      );

      // Mini in-prayer dialog bubbles
      setTimeout(() => {
        const coder = hqStore.getAgent(3);
        if (coder) coder.recentChatter = 'Allahu Akbar';
        hqStore.notify();
      }, 2000);

      setTimeout(() => {
        const tester = hqStore.getAgent(4);
        if (tester) tester.recentChatter = "Sami'allahu liman hamidah";
        hqStore.notify();
      }, 4500);

      setTimeout(() => {
        const director = hqStore.getAgent(1);
        if (director) director.recentChatter = "Assalamu'alaikum warahmatullah";
        hqStore.notify();
      }, 7000);
    }, 7500);
    this.stepTimeout.push(t3);

    // STEP 5: DOA & CONCLUSION (15 seconds)
    const t4 = setTimeout(() => {
      this.state.step = 'doa';
      this.notify();

      hqStore.sendMessage(
        'prayer-spiritual',
        'Ustadz Zaid: "Alhamdulillah salat berjamaah selesai. Semoga seluruh ikhtiar, inovasi, dan kode yang kita bangun membawa keberkahan. Silakan kembali beraktivitas."',
        'imam',
        12,
      );

      // Restore energy, boost mood, and clear currentActivity back to normal
      for (const agent of hqStore.agents) {
        agent.energy = Math.min(100, agent.energy + 40);
        agent.mood = 'productive';
        agent.currentRoutine = 'working';
        agent.location = 'AI HQ';

        // Revert activity label
        if (agent.role === 'coder') agent.currentActivity = '💻 Menulis Kode';
        else if (agent.role === 'tester') agent.currentActivity = '🧪 Pengujian QA';
        else if (agent.role === 'debugger') agent.currentActivity = '🐛 Investigasi Bug';
        else if (agent.role === 'reviewer') agent.currentActivity = '🔍 Review PR';
        else if (agent.role === 'director') agent.currentActivity = '🧠 Strategi AI';
        else if (agent.role === 'manager') agent.currentActivity = '📋 Supervisi Sprint';
        else agent.currentActivity = undefined;
      }
      hqStore.notify();

      // Walk agents back to their original desks
      if (this.officeState) {
        Object.entries(this.agentOriginalDesks).forEach(([idStr, pos], idx) => {
          const agentId = Number(idStr);
          setTimeout(() => {
            this.officeState?.walkToTile(agentId, pos.col, pos.row);
          }, idx * 180);
        });
      }
    }, 15000);
    this.stepTimeout.push(t4);

    // STEP 6: FINISHED & RESET (18 seconds)
    const t5 = setTimeout(() => {
      if (this.officeState) {
        for (const idStr of Object.keys(this.agentOriginalDesks)) {
          const agentId = Number(idStr);
          mosqueManager.putShoesOn(agentId);
          const ch = this.officeState.characters.get(agentId);
          if (ch) ch.state = CharacterState.TYPE;
        }
      }
      mosqueManager.resetOccupancy();

      this.state = {
        ...this.state,
        isActive: false,
        step: 'selesai',
        countdownSeconds: 0,
      };
      this.notify();
    }, 18000);
    this.stepTimeout.push(t5);
  }

  /**
   * Skip or instantly finish ongoing prayer
   */
  finishEarly() {
    for (const t of this.stepTimeout) clearTimeout(t);
    this.stepTimeout = [];

    for (const agent of hqStore.agents) {
      agent.energy = Math.min(100, agent.energy + 40);
      agent.mood = 'productive';
      agent.currentRoutine = 'working';
      agent.location = 'AI HQ';

      if (agent.role === 'coder') agent.currentActivity = '💻 Menulis Kode';
      else if (agent.role === 'tester') agent.currentActivity = '🧪 Pengujian QA';
      else if (agent.role === 'debugger') agent.currentActivity = '🐛 Investigasi Bug';
      else if (agent.role === 'reviewer') agent.currentActivity = '🔍 Review PR';
      else if (agent.role === 'director') agent.currentActivity = '🧠 Strategi AI';
      else if (agent.role === 'manager') agent.currentActivity = '📋 Supervisi Sprint';
      else agent.currentActivity = undefined;
    }
    hqStore.notify();

    if (this.officeState) {
      Object.entries(this.agentOriginalDesks).forEach(([idStr, pos]) => {
        this.officeState?.walkToTile(Number(idStr), pos.col, pos.row);
      });
    }

    this.state = {
      ...this.state,
      isActive: false,
      step: 'selesai',
      countdownSeconds: 0,
    };
    this.notify();
  }
}

export const adzanEventService = new AdzanEventService();
