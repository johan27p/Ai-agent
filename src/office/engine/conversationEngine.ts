import type { AILifeState } from './aiLife.js';

export interface Conversation {
  speakerId: number;
  listenerId: number;
  text: string;
  createdAt: number;
  duration: number;
}

// ── Combinatorial Dialogue Bank ──────────────────────────────────────────────

const GREETINGS = [
  'Halo',
  'Hei',
  'Pagi',
  'Wah',
  'Assalamu’alaikum',
  'Gimana',
  'Btw',
  'Eh',
  'Alhamdulillah',
  'Santai dulu,',
];

const MOSQUE_SUBJECTS = [
  'waktu sholat berjamaah',
  'tempat wudhu',
  'Al-Qur’an di rak',
  'sajadah di shaf depan',
  'suasana masjid',
  'kajian ba’da sholat',
  'kotak amal serambi',
];

const MOSQUE_ACTIONS = [
  'sudah siap, mari kita luruskan shaf.',
  'airnya sejuk dan segar sekali.',
  'mau saya baca beberapa ayat dulu.',
  'masih ada tempat yang kosong.',
  'terasa sangat tenang dan adem.',
  'sangat bermanfaat untuk bekal kita.',
  'jangan lupa sisihkan sedikit rezeki.',
];

const CAFE_SUBJECTS = [
  'kopi susu gula aren',
  'espresso double shot',
  'matcha latte',
  'croissant cokelat',
  'racikan barista Luna',
];

const CAFE_ACTIONS = [
  'enak banget, pas buat melek coding.',
  'aromanya harum dan mantap.',
  'bikin pikiran jadi segar kembali.',
  'rehat sejenak biar nggak burnout.',
  'selalu konsisten kualitasnya.',
];

const TECH_SUBJECTS = [
  'modul autentikasi',
  'automated test suite',
  'query database',
  'pull request review',
  'load server & memory',
  'pipeline deployment',
];

const TECH_ACTIONS = [
  'sudah hijau semua dan siap merge.',
  'perlu sedikit optimasi di loop-nya.',
  'responnya sangat cepat dan stabil.',
  'sudah saya approve di GitHub.',
  'thermal cooling dan CPU aman terkendali.',
  'berjalan mulus tanpa ada error.',
];

const CASUAL_SUBJECTS = [
  'cuaca hari ini',
  'rencana istirahat',
  'progres sprint',
  'kondisi kesehatan',
];

const CASUAL_ACTIONS = [
  'enak banget buat jalan sore di taman.',
  'nanti kita ngobrol lagi setelah selesai.',
  'alhamdulillah berjalan sesuai target.',
  'tetap jaga energi dan jangan begadang.',
];

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createConversation(
  speakerId: number,
  listenerId: number,
  speaker: AILifeState,
  listener: AILifeState,
  now: number,
): Conversation {
  const text = generateCombinatorialDialogue(speaker, listener);

  return {
    speakerId,
    listenerId,
    text,
    createdAt: now,
    duration: Math.max(2.5, Math.min(5.5, text.length * 0.065)),
  };
}

function generateCombinatorialDialogue(
  speaker: AILifeState,
  listener: AILifeState,
): string {
  const greeting = randomChoice(GREETINGS);

  // 1. Mosque context
  if (
    speaker.activity === 'PRAY' ||
    speaker.activity === 'WUDHU' ||
    speaker.currentPlace === 'MOSQUE' ||
    listener.currentPlace === 'MOSQUE'
  ) {
    const subj = randomChoice(MOSQUE_SUBJECTS);
    const act = randomChoice(MOSQUE_ACTIONS);
    return `${greeting}, ${subj} ${act}`;
  }

  // 2. Cafe / Drink / Food context
  if (
    speaker.activity === 'COFFEE' ||
    speaker.activity === 'DRINK' ||
    speaker.activity === 'EAT' ||
    speaker.currentPlace === 'CAFE' ||
    speaker.currentPlace === 'RESTAURANT'
  ) {
    const subj = randomChoice(CAFE_SUBJECTS);
    const act = randomChoice(CAFE_ACTIONS);
    return `${greeting}, ${subj} ${act}`;
  }

  // 3. Technical work / Coding / Meeting context
  if (
    speaker.activity === 'WORK' ||
    speaker.activity === 'TYPE' ||
    speaker.activity === 'MEETING' ||
    listener.activity === 'WORK'
  ) {
    const subj = randomChoice(TECH_SUBJECTS);
    const act = randomChoice(TECH_ACTIONS);
    return `${greeting}, ${subj} ${act}`;
  }

  // 4. Casual everyday context
  const subj = randomChoice(CASUAL_SUBJECTS);
  const act = randomChoice(CASUAL_ACTIONS);
  return `${greeting}, ${subj} ${act}`;
}
