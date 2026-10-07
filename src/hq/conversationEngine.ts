import { ROLE_DEFINITIONS } from './roles.js';
import type { ChannelId, HQAgent, RoleId } from './types.js';

export type PersonalityTrait =
  | 'santai'
  | 'perfeksionis'
  | 'humoris'
  | 'tenang_solutif'
  | 'analitis'
  | 'ramah_perhatian'
  | 'tegas_terstruktur';

export type TopicCategory =
  | 'pekerjaan'
  | 'bug_investigasi'
  | 'build_deploy'
  | 'kopi_rehat'
  | 'makan_kantin'
  | 'sholat_masjid'
  | 'kebersihan_fasilitas'
  | 'server_hardware'
  | 'obrolan_santai'
  | 'meeting_strategi';

export interface AgentPersona {
  role: RoleId;
  traits: PersonalityTrait[];
  honorificPrefix: string; // e.g. "Mas", "Mbak", "Pak", "Dok", "Ustadz"
  casualGreetings: string[];
  speechQuirks: string[];
}

export const AGENT_PERSONAS: Record<RoleId, AgentPersona> = {
  owner: {
    role: 'owner',
    traits: ['tegas_terstruktur', 'tenang_solutif'],
    honorificPrefix: 'Pak Owner',
    casualGreetings: ['Rekan-rekan', 'Tim', 'Halo semua'],
    speechQuirks: ['Pastikan prioritas terjaga', 'Pertahankan kualitas'],
  },
  director: {
    role: 'director',
    traits: ['tegas_terstruktur', 'tenang_solutif'],
    honorificPrefix: 'Pak Alex',
    casualGreetings: ['Halo rekan-rekan', 'Selamat pagi tim', 'Semuanya'],
    speechQuirks: ['Secara high-level', 'Secara arsitektural', 'Goal sprint kita'],
  },
  manager: {
    role: 'manager',
    traits: ['tegas_terstruktur', 'ramah_perhatian'],
    honorificPrefix: 'Mbak Sarah',
    casualGreetings: ['Pagi tim', 'Teman-teman', 'Halo rekan engineering'],
    speechQuirks: ['Bisa di-track di Jira', 'Tolong prioritaskan', 'Target kita hari ini'],
  },
  coder: {
    role: 'coder',
    traits: ['santai', 'tenang_solutif'],
    honorificPrefix: 'Mas Devon',
    casualGreetings: ['Halo', 'Bro', 'Pagi', 'Siap'],
    speechQuirks: ['Logikanya udah masuk', 'Tinggal refactor dikit', 'Di local aman sih'],
  },
  tester: {
    role: 'tester',
    traits: ['perfeksionis', 'analitis'],
    honorificPrefix: 'Mbak Tara',
    casualGreetings: ['Halo Mas', 'Pagi', 'Izin update'],
    speechQuirks: ['Ada edge-case baru nih', 'Pas dikasih input minus error', 'Regression test lolos'],
  },
  debugger: {
    role: 'debugger',
    traits: ['analitis', 'humoris'],
    honorificPrefix: 'Mas Fikri',
    casualGreetings: ['Halo tim', 'Aman', 'Siap meluncur'],
    speechQuirks: ['Tersangka utamanya ketemu', 'Memory dump-nya kebaca', 'Biar saya bedah dulu'],
  },
  reviewer: {
    role: 'reviewer',
    traits: ['perfeksionis', 'tenang_solutif'],
    honorificPrefix: 'Mas Kenji',
    casualGreetings: ['Halo rekan', 'Selamat siang', 'Pagi'],
    speechQuirks: ['Clean code banget', 'Perlu sedikit guard clause', 'Approved to merge'],
  },
  researcher: {
    role: 'researcher',
    traits: ['analitis', 'santai'],
    honorificPrefix: 'Dok Maya',
    casualGreetings: ['Halo teman-teman', 'Dokumen riset ready', 'Pagi'],
    speechQuirks: ['Secara empiris', 'Latensi turun 18%', 'Eksperimen baru menunjukkan'],
  },
  security: {
    role: 'security',
    traits: ['tegas_terstruktur', 'analitis'],
    honorificPrefix: 'Mas Farhan',
    casualGreetings: ['Alert tim', 'Log monitor', 'Halo'],
    speechQuirks: ['Zero-trust guard', 'Traffic packet anomali', 'Firewall hijau'],
  },
  janitor: {
    role: 'janitor',
    traits: ['ramah_perhatian', 'santai'],
    honorificPrefix: 'Pak Sami',
    casualGreetings: ['Selamat pagi semuanya', 'Permisi ya', 'Halo'],
    speechQuirks: ['Biar makin nyaman kerjanya', 'Sudah bersih berkilau', 'Tanaman sudah segar'],
  },
  maintenance: {
    role: 'maintenance',
    traits: ['tenang_solutif', 'santai'],
    honorificPrefix: 'Mas Rizal',
    casualGreetings: ['Halo tim', 'Laporan cek hardware', 'Siap'],
    speechQuirks: ['Suhu AC stabil', 'Thermal paste diganti', 'Hardware aman terkendali'],
  },
  barista: {
    role: 'barista',
    traits: ['ramah_perhatian', 'humoris'],
    honorificPrefix: 'Mbak Luna',
    casualGreetings: ['Pagi semua!', 'Halo penikmat kopi', 'Semangat kerjanya!'],
    speechQuirks: ['Espresso double shot siap', 'Recharge dulu yuk', 'Jangan lupa minum air putih'],
  },
  imam: {
    role: 'imam',
    traits: ['tenang_solutif', 'ramah_perhatian'],
    honorificPrefix: 'Ustadz Zaid',
    casualGreetings: ['Assalamu’alaikum rekan-rekan', 'Semoga hari kita berkah', 'Bismillah'],
    speechQuirks: ['Seimbangkan ikhtiar dan doa', 'Mari sholat berjamaah', 'Alhamdulillah'],
  },
};

export function getPoliteAddress(speakerRole: RoleId, addresseeRole: RoleId): string {
  const addresseePersona = AGENT_PERSONAS[addresseeRole];
  if (!addresseePersona) return 'Rekan';

  // Specific respectful address
  if (addresseeRole === 'director') return 'Pak Alex';
  if (addresseeRole === 'manager') return 'Mbak Sarah';
  if (addresseeRole === 'imam') return 'Ustadz Zaid';
  if (addresseeRole === 'researcher') return 'Dok Maya';
  if (addresseeRole === 'janitor') return 'Pak Sami';

  // Senior / peer engineer
  if (speakerRole === 'manager' || speakerRole === 'director') {
    // Manager calls subordinates by polite first name or Mas/Mbak
    return addresseePersona.honorificPrefix;
  }

  return addresseePersona.honorificPrefix;
}

// ─────────────────────────────────────────────────────────────────────────────
// DIALOGUE DICTIONARY: Combinatorial Indonesian Real-Life Matrix
// Generates millions of multi-turn permutations
// ─────────────────────────────────────────────────────────────────────────────

interface DialogueTurn {
  senderRole: RoleId;
  content: string;
}

interface DialoguePattern {
  topic: TopicCategory;
  channel: ChannelId;
  primaryRole: RoleId;
  secondaryRole: RoleId;
  generateTurns: (speakerA: HQAgent, speakerB: HQAgent) => DialogueTurn[];
}

export const GENERATIVE_PATTERNS: DialoguePattern[] = [
  // 1. CODING & TESTING
  {
    topic: 'pekerjaan',
    channel: 'engineering',
    primaryRole: 'tester',
    secondaryRole: 'coder',
    generateTurns: (tester, coder) => {
      const sapaCoder = getPoliteAddress('tester', 'coder');
      const sapaTester = getPoliteAddress('coder', 'tester');
      const modules = ['modul pembayaran', 'validasi keranjang belanja', 'endpoint auth token', 'filter pencarian data', 'ekspor laporan transaksi'];
      const errors = ['error di parsing nominal minus', 'timeout waktu query load berat', 'token kedaluwarsa sebelum redirect', 'validasi email belum lolos regex'];
      const fixes = ['ganti tipe datanya ke integer cents', 'tambah debounce query 300ms', 'sesuaikan refresh token payload', 'update pattern validator-nya'];

      const mod = modules[Math.floor(Math.random() * modules.length)];
      const err = errors[Math.floor(Math.random() * errors.length)];
      const fix = fixes[Math.floor(Math.random() * fixes.length)];

      return [
        {
          senderRole: 'tester',
          content: `${sapaCoder}, ${mod} yang tadi sudah bisa dites belum? Mau saya jalankan automated test-nya.`,
        },
        {
          senderRole: 'coder',
          content: `Belum sepenuhnya, ${sapaTester}. Pas dites lokal tadi masih ada ${err}.`,
        },
        {
          senderRole: 'tester',
          content: `Oh, yang ${err}? Mau saya kirim sample payload JSON dan log call stack-nya biar lebih cepat?`,
        },
        {
          senderRole: 'coder',
          content: `Boleh banget, terima kasih! Rencananya saya mau ${fix} biar langsung clean.`,
        },
        {
          senderRole: 'tester',
          content: `Sip! Segera saya kirim di chat. Begitu commit baru naik, saya langsung trigger test suite lagi.`,
        },
      ];
    },
  },

  // 2. DEBUGGING & HOTFIX
  {
    topic: 'bug_investigasi',
    channel: 'engineering',
    primaryRole: 'debugger',
    secondaryRole: 'manager',
    generateTurns: (debuggerAgent, manager) => {
      const sapaMgr = getPoliteAddress('debugger', 'manager');
      const sapaDbg = getPoliteAddress('debugger', 'debugger');
      const bugs = ['memory leak pada worker pool', 'race condition di service notifikasi', 'unhandled promise rejection di database pool', 'deadlock transaksi concurrent'];
      const solutions = ['optimasi lifecycle connection pool', 'tambah mutex lock pada worker', 'tutup koneksi idle di background', 'perbaiki ordering lock tabel'];

      const bug = bugs[Math.floor(Math.random() * bugs.length)];
      const sol = solutions[Math.floor(Math.random() * solutions.length)];

      return [
        {
          senderRole: 'debugger',
          content: `Lapor ${sapaMgr}, investigasi tiket BUG-${Math.floor(100 + Math.random() * 900)} selesai. Sumber masalahnya ada di ${bug}.`,
        },
        {
          senderRole: 'manager',
          content: `Bagus ${sapaDbg}. Dampaknya ke user seberapa signifikan? Apa perlu rollback atau cukup hotfix langsung?`,
        },
        {
          senderRole: 'debugger',
          content: `Cukup hotfix langsung. Solusinya kita ${sol}. Tidak ada breaking change ke service lain.`,
        },
        {
          senderRole: 'manager',
          content: `Oke, eksekusi sekarang ya. Setelah lolos QA, langsung minta ${getPoliteAddress('manager', 'reviewer')} buat audit PR-nya.`,
        },
      ];
    },
  },

  // 3. CODE REVIEW & APPROVAL
  {
    topic: 'build_deploy',
    channel: 'engineering',
    primaryRole: 'reviewer',
    secondaryRole: 'coder',
    generateTurns: (reviewer, coder) => {
      const sapaCoder = getPoliteAddress('reviewer', 'coder');
      const sapaRev = getPoliteAddress('coder', 'reviewer');
      const prId = `#${Math.floor(40 + Math.random() * 60)}`;
      const praises = ['Struktur kodenya rapi dan modular', 'Test coverage-nya komprehensif', 'Error handling-nya sudah solid'];

      const praise = praises[Math.floor(Math.random() * praises.length)];

      return [
        {
          senderRole: 'reviewer',
          content: `${sapaCoder}, PR ${prId} sudah selesai saya review. ${praise}.`,
        },
        {
          senderRole: 'coder',
          content: `Alhamdulillah, terima kasih ${sapaRev}. Ada catatan khusus untuk optimasi lanjutan?`,
        },
        {
          senderRole: 'reviewer',
          content: `Hanya sedikit catatan minor untuk penamaan enum di constants, tapi secara fungsi sudah siap produksi. Approved!`,
        },
        {
          senderRole: 'coder',
          content: `Siap, langsung saya merge ke branch staging untuk verifikasi deployment.`,
        },
      ];
    },
  },

  // 4. KOPI & ISTIRAHAT CAFE
  {
    topic: 'kopi_rehat',
    channel: 'operations',
    primaryRole: 'barista',
    secondaryRole: 'coder',
    generateTurns: (barista, coder) => {
      const sapaCoder = getPoliteAddress('barista', 'coder');
      const sapaBarista = getPoliteAddress('coder', 'barista');
      const drinks = ['Single Origin Arabica Gayo', 'Iced Matcha Latte', 'Americano dingin', 'Cappuccino hangat dengan oat milk'];
      const drink = drinks[Math.floor(Math.random() * drinks.length)];

      return [
        {
          senderRole: 'barista',
          content: `${sapaCoder}, dari tadi kelihatan fokus banget di depan layar. Mau dibikinkan ${drink} buat recharge stamina?`,
        },
        {
          senderRole: 'coder',
          content: `Wah pas banget ${sapaBarista}, mata udah agak berat nih ngeliatin compiler. Boleh satu gelas ya!`,
        },
        {
          senderRole: 'barista',
          content: `Siap meluncur! Duduk santai 5 menit di sofa lounge ya biar otot lehernya rileks juga.`,
        },
        {
          senderRole: 'coder',
          content: `Terima kasih banyak ${sapaBarista}, kopi di sini emang selalu jadi penyelamat deadline.`,
        },
      ];
    },
  },

  // 5. MAKAN & KANTIN
  {
    topic: 'makan_kantin',
    channel: 'operations',
    primaryRole: 'tester',
    secondaryRole: 'debugger',
    generateTurns: (tester, debuggerAgent) => {
      const sapaDbg = getPoliteAddress('tester', 'debugger');
      const sapaTst = getPoliteAddress('debugger', 'tester');
      const foods = ['Nasi Padang depan kantor', 'Soto Ayam Lamongan', 'Ayam Geprek sambal bawang', 'Gado-gado segar'];
      const food = foods[Math.floor(Math.random() * foods.length)];

      return [
        {
          senderRole: 'tester',
          content: `${sapaDbg}, sudah masuk jam istirahat siang nih. Saya mau ke kantin pesan ${food}. Mau titip?`,
        },
        {
          senderRole: 'debugger',
          content: `Wah boleh tuh ${sapaTst}! Saya titip satu porsi ya, sambalnya dipisah kalau bisa. Ini saya selesaikan 1 function dulu.`,
        },
        {
          senderRole: 'tester',
          content: `Oke siap. Minumnya mau apa? Es teh manis atau jus jeruk?`,
        },
        {
          senderRole: 'debugger',
          content: `Es teh manis saja. Nanti saya transfer ya. Makasih banyak sudah ditawari!`,
        },
      ];
    },
  },

  // 6. SHOLAT & MASJID
  {
    topic: 'sholat_masjid',
    channel: 'prayer-spiritual',
    primaryRole: 'imam',
    secondaryRole: 'manager',
    generateTurns: (imam, manager) => {
      const sapaMgr = getPoliteAddress('imam', 'manager');
      const sapaImam = getPoliteAddress('manager', 'imam');

      return [
        {
          senderRole: 'imam',
          content: `Assalamu’alaikum ${sapaMgr}, waktu sholat sudah masuk. Marilah kita ingatkan rekan-rekan untuk rehat sejenak dan sholat berjamaah di Masjid.`,
        },
        {
          senderRole: 'manager',
          content: `Wa’alaikumsalam ${sapaImam}. Siap, saya umumkan ke seluruh channel agar tim save state dan menuju Masjid.`,
        },
        {
          senderRole: 'imam',
          content: `Alhamdulillah. Bekerja keras itu mulia, namun menjaga ibadah tepat waktu akan mendatangkan berkah pada setiap baris kode yang dibuat.`,
        },
        {
          senderRole: 'manager',
          content: `Betul sekali ${sapaImam}. Tim yang tenang batinnya terbukti menghasilkan kualitas sistem yang jauh lebih stabil.`,
        },
      ];
    },
  },

  // 7. KEBERSIHAN & FASILITAS KANTOR
  {
    topic: 'kebersihan_fasilitas',
    channel: 'operations',
    primaryRole: 'janitor',
    secondaryRole: 'manager',
    generateTurns: (janitor, manager) => {
      const sapaMgr = getPoliteAddress('janitor', 'manager');
      const sapaJnt = getPoliteAddress('manager', 'janitor');
      const areas = ['area workstation Lab', 'ruang meeting utama', 'lorong Data Center', 'taman zen luar'];
      const area = areas[Math.floor(Math.random() * areas.length)];

      return [
        {
          senderRole: 'janitor',
          content: `Permisi ${sapaMgr}, saya sudah selesai menyapu, mengepel, dan mengosongkan tempat sampah di ${area}.`,
        },
        {
          senderRole: 'manager',
          content: `Terima kasih banyak ${sapaJnt}! Ruangannya terlihat sangat rapi dan segar hari ini.`,
        },
        {
          senderRole: 'janitor',
          content: `Sama-sama. Tanaman hias di sudut meja juga sudah saya siram agar udara di ruangan tetap asri dan sejuk.`,
        },
        {
          senderRole: 'manager',
          content: `Luar biasa dedikasinya. Tempat yang bersih sangat membantu tim tetap fokus dan tidak mudah stres.`,
        },
      ];
    },
  },

  // 8. SERVER, HARDWARE & PENDINGIN DATA CENTER
  {
    topic: 'server_hardware',
    channel: 'security-devops',
    primaryRole: 'maintenance',
    secondaryRole: 'security',
    generateTurns: (maint, sec) => {
      const sapaSec = getPoliteAddress('maintenance', 'security');
      const sapaMnt = getPoliteAddress('security', 'maintenance');
      const racks = ['Rack Server 01', 'Rack Server 02', 'Cluster Database Primary', 'Node Load Balancer'];
      const rack = racks[Math.floor(Math.random() * racks.length)];
      const temp = Math.floor(62 + Math.random() * 5);

      return [
        {
          senderRole: 'maintenance',
          content: `${sapaSec}, pengecekan rutin hardware selesai. Sistem sirkulasi pendingin di ${rack} berjalan normal. Suhu stabil di ${temp}°C.`,
        },
        {
          senderRole: 'security',
          content: `Mantap ${sapaMnt}. Grafik monitoring throughput jaringan juga konstan, tidak ada packet loss atau getaran anomali.`,
        },
        {
          senderRole: 'maintenance',
          content: `Blower fan cadangan juga sudah dites auto-failovernya. Jadi kalau ada lonjakan beban komputasi mendadak, thermal-nya aman.`,
        },
        {
          senderRole: 'security',
          content: `Kerja yang sangat baik. Uptime 99.98% terjaga berkat koordinasi cepat divisi infrastruktur dan maintenance.`,
        },
      ];
    },
  },

  // 9. OBROLAN SANTAI & CUACA KANTOR
  {
    topic: 'obrolan_santai',
    channel: 'operations',
    primaryRole: 'researcher',
    secondaryRole: 'coder',
    generateTurns: (researcher, coder) => {
      const sapaCoder = getPoliteAddress('researcher', 'coder');
      const sapaRes = getPoliteAddress('coder', 'researcher');
      const chitChats = [
        'Hari ini suasananya produktif banget ya, dari pagi ritme kerjanya enak.',
        'Di luar kelihatannya mendung berawan, adem banget suasananya buat ngoding.',
        'Sprint minggu ini rasanya lebih lancar ya dibanding minggu lalu.',
      ];
      const chat = chitChats[Math.floor(Math.random() * chitChats.length)];

      return [
        {
          senderRole: 'researcher',
          content: `${sapaCoder}, ${chat}`,
        },
        {
          senderRole: 'coder',
          content: `Iya nih ${sapaRes}, untung flow arsitektur baru dari AI Director bikin pembagian tugasnya jelas banget.`,
        },
        {
          senderRole: 'researcher',
          content: `Betul, apalagi tim QA dan Security responnya cepat sekali kalau ada hal yang butuh verifikasi.`,
        },
        {
          senderRole: 'coder',
          content: `Benar, kerja sama tim yang solid bikin coding rumit sekalipun jadi terasa ringan.`,
        },
      ];
    },
  },
];

export class ConversationEngine {
  private lastDialogueTime = 0;
  private messageHistory: string[] = [];

  /**
   * Generates a completely dynamic natural multi-turn Indonesian conversation
   */
  generateConversation(
    agents: HQAgent[],
    requestedTopic?: TopicCategory,
  ): {
    channel: ChannelId;
    turns: Array<{
      senderId: number;
      senderName: string;
      senderRole: RoleId;
      senderAvatar: string;
      content: string;
      delayMs: number;
    }>;
  } {
    // Select pattern by topic or random
    const availablePatterns = requestedTopic
      ? GENERATIVE_PATTERNS.filter((p) => p.topic === requestedTopic)
      : GENERATIVE_PATTERNS;

    const pattern =
      availablePatterns.length > 0
        ? availablePatterns[Math.floor(Math.random() * availablePatterns.length)]
        : GENERATIVE_PATTERNS[0];

    const agentA = agents.find((a) => a.role === pattern.primaryRole) ?? agents[0];
    const agentB = agents.find((a) => a.role === pattern.secondaryRole) ?? agents[1];

    const rawTurns = pattern.generateTurns(agentA, agentB);

    let cumulativeDelay = 600;
    const turns = rawTurns.map((turn, idx) => {
      const senderAgent = agents.find((a) => a.role === turn.senderRole) ?? agentA;
      // Stagger realistic typing delays: 2.5s - 4.5s per turn
      const delay = idx === 0 ? 500 : cumulativeDelay;
      cumulativeDelay += Math.floor(2800 + Math.random() * 1800);

      return {
        senderId: senderAgent.id,
        senderName: senderAgent.name,
        senderRole: senderAgent.role,
        senderAvatar: senderAgent.avatar,
        content: turn.content,
        delayMs: delay,
      };
    });

    this.lastDialogueTime = Date.now();
    return {
      channel: pattern.channel,
      turns,
    };
  }
}

export const conversationEngine = new ConversationEngine();
