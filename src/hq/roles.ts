import type { RoleId, RoleMeta } from './types.js';

export const ROLE_DEFINITIONS: Record<RoleId, RoleMeta> = {
  owner: {
    id: 'owner',
    title: 'Owner / Founder',
    department: 'Executive Board',
    icon: '👑',
    badgeColor: '#eab308', // gold
    reportsTo: null,
    description: 'Pemilik perusahaan & penentu visi strategis utama.',
  },
  director: {
    id: 'director',
    title: 'AI Director',
    department: 'Executive Leadership',
    icon: '🧠',
    badgeColor: '#a855f7', // purple
    reportsTo: 'owner',
    description: 'Orkestrator tertinggi operasional AI, delegasi target & evaluasi sprint.',
  },
  manager: {
    id: 'manager',
    title: 'Engineering Manager',
    department: 'Engineering',
    icon: '👔',
    badgeColor: '#3b82f6', // blue
    reportsTo: 'director',
    description: 'Manajer divisi teknis: pembagian tugas coder, tester, debugger, dan reviewer.',
  },
  coder: {
    id: 'coder',
    title: 'Senior Coder',
    department: 'Engineering',
    icon: '👨‍💻',
    badgeColor: '#06b6d4', // cyan
    reportsTo: 'manager',
    description: 'Implementasi fitur sistem, arsitektur kode & pembuatan modul inti.',
  },
  tester: {
    id: 'tester',
    title: 'QA Tester',
    department: 'Quality Assurance',
    icon: '🧪',
    badgeColor: '#10b981', // emerald
    reportsTo: 'manager',
    description: 'Menjalankan unit test, e2e testing & memverifikasi validasi sistem.',
  },
  debugger: {
    id: 'debugger',
    title: 'Bug Hunter & Debugger',
    department: 'Quality Assurance',
    icon: '🐛',
    badgeColor: '#ef4444', // red
    reportsTo: 'manager',
    description: 'Investigasi log error, memory leak & perbaikan bug mendesak.',
  },
  reviewer: {
    id: 'reviewer',
    title: 'Code Reviewer',
    department: 'Engineering',
    icon: '🔍',
    badgeColor: '#8b5cf6', // violet
    reportsTo: 'manager',
    description: 'Review pull request, audit keamanan kode & persetujuan merge.',
  },
  researcher: {
    id: 'researcher',
    title: 'AI Researcher',
    department: 'R&D',
    icon: '🔬',
    badgeColor: '#ec4899', // pink
    reportsTo: 'director',
    description: 'Riset model LLM, benchmarking algoritma & optimasi arsitektur.',
  },
  security: {
    id: 'security',
    title: 'DevOps & Security',
    department: 'Infrastructure',
    icon: '🛡️',
    badgeColor: '#f97316', // orange
    reportsTo: 'director',
    description: 'Monitor server uptime, firewall, SSL certs & pertahanan data.',
  },
  janitor: {
    id: 'janitor',
    title: 'Facility Janitor',
    department: 'Operations',
    icon: '🧹',
    badgeColor: '#84cc16', // lime
    reportsTo: 'director',
    description: 'Membersihkan workstation, membuang sampah & merawat taman kantor.',
  },
  maintenance: {
    id: 'maintenance',
    title: 'Maintenance Engineer',
    department: 'Operations',
    icon: '🔧',
    badgeColor: '#64748b', // slate
    reportsTo: 'director',
    description: 'Menangani hardware server, pendingin data center & fasilitas gedung.',
  },
  barista: {
    id: 'barista',
    title: 'Cafe Barista & Service',
    department: 'Hospitality',
    icon: '☕',
    badgeColor: '#d97706', // amber
    reportsTo: 'director',
    description: 'Menyajikan kopi espresso & menjaga stamina dan mood seluruh tim.',
  },
  imam: {
    id: 'imam',
    title: 'Spiritual Guide / Imam',
    department: 'Community & Masjid',
    icon: '🕌',
    badgeColor: '#059669', // green
    reportsTo: 'director',
    description: 'Pengingat waktu sholat, pembimbing doa & menjaga kedamaian tim.',
  },
};
