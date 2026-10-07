import type { ChannelId, HQAgent, HQMessage, RoleId } from './types.js';

export interface DialogueStep {
  senderRole: RoleId;
  channel: ChannelId;
  content: string;
  delayMs: number;
  routine?: string;
}

export const CHAIN_SCENARIOS: Array<{
  name: string;
  steps: DialogueStep[];
}> = [
  {
    name: 'feature_pipeline',
    steps: [
      {
        senderRole: 'coder',
        channel: 'engineering',
        content: 'Saya sudah menyelesaikan implementasi sistem login dan JWT token authentication.',
        delayMs: 800,
      },
      {
        senderRole: 'tester',
        channel: 'engineering',
        content: 'Menjalankan test suite... Saya menemukan 2 error pada validasi password minimal 8 karakter dan special symbol.',
        delayMs: 3500,
      },
      {
        senderRole: 'debugger',
        channel: 'engineering',
        content: 'Saya ambil tiket tersebut (BUG-104). Sedang menganalisis regex validator di authService.ts.',
        delayMs: 6500,
      },
      {
        senderRole: 'debugger',
        channel: 'engineering',
        content: 'Fix berhasil diaplikasikan. Regex password validator telah diperbarui dan lulus unit test lokal.',
        delayMs: 10000,
      },
      {
        senderRole: 'reviewer',
        channel: 'engineering',
        content: 'PR #42 sudah saya audit. Struktur bersih, error handling aman. Approved for merge!',
        delayMs: 13500,
      },
      {
        senderRole: 'manager',
        channel: 'engineering',
        content: 'Kerja bagus tim. Lanjutkan ke modul pembayaran sampai semua coverage 100%.',
        delayMs: 16500,
      },
      {
        senderRole: 'manager',
        channel: 'announcements',
        content: '📊 Laporan Sprint: Modul Auth telah diverifikasi & dimerge. Progress proyek kini mencapai 82%.',
        delayMs: 19500,
      },
    ],
  },
  {
    name: 'server_maintenance',
    steps: [
      {
        senderRole: 'security',
        channel: 'security-devops',
        content: '⚠️ ALERT: Sensor server Data Center mencatat lonjakan traffic dan suhu rack-02 mencapai 81°C!',
        delayMs: 600,
      },
      {
        senderRole: 'maintenance',
        channel: 'operations',
        content: '🔧 Saya langsung menuju Data Center. Memeriksa unit cooling pendingin dan thermal paste CPU.',
        delayMs: 3200,
      },
      {
        senderRole: 'maintenance',
        channel: 'security-devops',
        content: 'Fan blower nomor 3 sempat macet karena debu. Sudah dibersihkan dan unit pendingin cadangan aktif.',
        delayMs: 7000,
      },
      {
        senderRole: 'security',
        channel: 'security-devops',
        content: 'Suhu stabil kembali di 64°C. Tidak ada packet drop. Server normal 100%.',
        delayMs: 10500,
      },
      {
        senderRole: 'director',
        channel: 'announcements',
        content: 'Insiden server tertangani dalam 2 menit oleh tim Maintenance & Security. Sistem aman terkendali.',
        delayMs: 14000,
      },
    ],
  },
  {
    name: 'prayer_routine',
    steps: [
      {
        senderRole: 'imam',
        channel: 'prayer-spiritual',
        content: '🕌 Waktu Sholat telah tiba. Marilah kita istirahat sejenak, simpan pekerjaan (save state), dan tunaikan sholat di Masjid.',
        delayMs: 500,
      },
      {
        senderRole: 'coder',
        channel: 'engineering',
        content: 'Git commit aman. Menuju Masjid untuk sholat.',
        delayMs: 2500,
      },
      {
        senderRole: 'manager',
        channel: 'announcements',
        content: 'Jeda sholat 15 menit. Seluruh agent yang bertugas diharap rehat dan menenangkan pikiran.',
        delayMs: 4500,
      },
      {
        senderRole: 'imam',
        channel: 'prayer-spiritual',
        content: 'Alhamdulillah sholat berjamaah selesai. Semoga kerja dan kontribusi tim hari ini membawa berkah.',
        delayMs: 10000,
      },
      {
        senderRole: 'coder',
        channel: 'engineering',
        content: 'Kembali ke workstation dengan pikiran segar. Melanjutkan optimasi query database.',
        delayMs: 13000,
      },
    ],
  },
  {
    name: 'coffee_morale',
    steps: [
      {
        senderRole: 'barista',
        channel: 'operations',
        content: '☕ Fresh brew Arabica & Matcha Latte sudah tersedia di Cafe & Lounge! Silakan recharge stamina.',
        delayMs: 700,
      },
      {
        senderRole: 'researcher',
        channel: 'operations',
        content: 'Pas sekali, butuh kafein setelah analisa benchmark model selesai. Meluncur ke cafe!',
        delayMs: 3000,
      },
      {
        senderRole: 'janitor',
        channel: 'operations',
        content: '🧹 Meja cafe dan area lounge sudah dibersihkan dan disanitasi. Selamat menikmati waktu rehat.',
        delayMs: 5500,
      },
    ],
  },
  {
    name: 'clean_office',
    steps: [
      {
        senderRole: 'janitor',
        channel: 'operations',
        content: '🧹 Memulai rutinitas pembersihan: mengosongkan tempat sampah, merapikan meja lab, dan menyiram tanaman taman.',
        delayMs: 600,
      },
      {
        senderRole: 'janitor',
        channel: 'operations',
        content: '✨ Pembersihan selesai. Ruang kerja rapi, lantai bersih kilap, dan sirkulasi udara segar.',
        delayMs: 6000,
      },
      {
        senderRole: 'manager',
        channel: 'operations',
        content: 'Terima kasih tim Janitor. Tempat kerja yang bersih membuat produktivitas tim naik drastis!',
        delayMs: 8500,
      },
    ],
  },
];

export function generateOwnerCommandResponse(
  command: string,
  agents: HQAgent[],
): { replyAgentRole: RoleId; responseText: string; assignedAgentRole?: RoleId; targetTask?: string } {
  const lower = command.toLowerCase();

  if (lower.includes('sholat') || lower.includes('masjid') || lower.includes('doa')) {
    return {
      replyAgentRole: 'imam',
      responseText: `Bismillah. Siap Pak Owner. Saya kumandangkan panggilan sholat sekarang agar tim dapat menunaikan ibadah dengan khusyuk.`,
      targetTask: 'Menunaikan Sholat Berjamaah di Masjid',
    };
  }

  if (lower.includes('bersih') || lower.includes('janitor') || lower.includes('sampah') || lower.includes('kotor')) {
    return {
      replyAgentRole: 'janitor',
      responseText: `Siap laksanakan, Owner! Saya segera membersihkan seluruh area workstation, koridor, dan merawat tanaman taman.`,
      assignedAgentRole: 'janitor',
      targetTask: 'Membersihkan Workstation & Area Kantor',
    };
  }

  if (lower.includes('server') || lower.includes('rusak') || lower.includes('mati') || lower.includes('suhu') || lower.includes('panas')) {
    return {
      replyAgentRole: 'maintenance',
      responseText: `Laporan diterima, Owner! Segera memeriksa rack server, cooling system, dan jaringan di Data Center.`,
      assignedAgentRole: 'maintenance',
      targetTask: 'Perbaikan & Optimasi Rack Server Data Center',
    };
  }

  if (lower.includes('kopi') || lower.includes('makan') || lower.includes('istirahat') || lower.includes('cafe')) {
    return {
      replyAgentRole: 'barista',
      responseText: `Siap, Owner! Menu spesial hari ini siap disajikan di Cafe Lounge agar tim kembali berenergi 100%.`,
      assignedAgentRole: 'barista',
      targetTask: 'Menyiapkan Kopi & Snack di Cafe',
    };
  }

  if (lower.includes('bug') || lower.includes('error') || lower.includes('fix') || lower.includes('rusak')) {
    return {
      replyAgentRole: 'debugger',
      responseText: `Diterima, Owner! Saya langsung melacak call stack dan memory dump untuk menyelesaikan bug tersebut.`,
      assignedAgentRole: 'debugger',
      targetTask: 'Investigasi & Fix Bug Prioritas Tinggi',
    };
  }

  if (lower.includes('test') || lower.includes('uji') || lower.includes('qa')) {
    return {
      replyAgentRole: 'tester',
      responseText: `Siap, Owner. Menjalankan skenario regression test dan stress testing pada semua endpoint.`,
      assignedAgentRole: 'tester',
      targetTask: 'Menjalankan Full Regression Test Suite',
    };
  }

  if (lower.includes('laporan') || lower.includes('report') || lower.includes('status') || lower.includes('progres')) {
    return {
      replyAgentRole: 'manager',
      responseText: `Laporan siap, Owner. Proyek berjalan sesuai roadmap: 82% fitur selesai, 142 test lolos, uptime server 99.98%.`,
      targetTask: 'Menyusun Laporan Eksekutif Harian',
    };
  }

  // Default: Director response delegating to appropriate manager
  return {
    replyAgentRole: 'director',
    responseText: `Instruksi diterima, Owner: "${command}". Saya koordinasikan dengan Engineering Manager dan divisi terkait untuk segera dieksekusi.`,
    assignedAgentRole: 'coder',
    targetTask: `Eksekusi Instruksi Owner: ${command.slice(0, 32)}...`,
  };
}
