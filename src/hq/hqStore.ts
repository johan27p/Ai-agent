import { CHAIN_SCENARIOS, generateOwnerCommandResponse } from './dialogueEngine.js';
import { conversationEngine, type TopicCategory } from './conversationEngine.js';
import { cityNeedsEngine } from '../city/needsSystem.js';
import { adzanEventService } from '../city/adzanService.js';
import { ROLE_DEFINITIONS } from './roles.js';
import type {
  ChannelId,
  DailyReport,
  HQAgent,
  HQMessage,
  RoleId,
  RoutineType,
  TimeOfDay,
} from './types.js';

const INITIAL_AGENTS: HQAgent[] = [
  {
    id: 1,
    name: 'Alex',
    role: 'director',
    palette: 1,
    avatar: '🧠',
    energy: 92,
    workProgress: 85,
    mood: 'focused',
    currentRoutine: 'working',
    currentTask: 'Orkestrasi Sprint Q4 & Evaluasi Arsitektur AI',
    location: 'AI HQ',
    supervisorId: null, // reports to Owner
    subordinateIds: [2, 7, 8, 9, 10, 11, 12],
    recentChatter: 'Menjaga alignment seluruh divisi dengan visi Owner.',
  },
  {
    id: 2,
    name: 'Sarah',
    role: 'manager',
    palette: 0,
    avatar: '👔',
    energy: 88,
    workProgress: 79,
    mood: 'productive',
    currentRoutine: 'working',
    currentTask: 'Supervisi Tim Coder, Tester & Reviewer',
    location: 'AI HQ',
    supervisorId: 1,
    subordinateIds: [3, 4, 5, 6],
    recentChatter: 'Sprint backlog berjalan 82% sesuai timeline.',
  },
  {
    id: 3,
    name: 'Devon',
    role: 'coder',
    palette: 3,
    avatar: '👨‍💻',
    energy: 78,
    workProgress: 88,
    mood: 'focused',
    currentRoutine: 'working',
    currentTask: 'Implementasi Core Microservice & REST APIs',
    location: 'AI HQ',
    supervisorId: 2,
    subordinateIds: [],
    recentChatter: 'Unit test authentication lulus 100%.',
  },
  {
    id: 4,
    name: 'Tara',
    role: 'tester',
    palette: 2,
    avatar: '🧪',
    energy: 84,
    workProgress: 75,
    mood: 'alert',
    currentRoutine: 'working',
    currentTask: 'Automated E2E Testing & Performance Profiling',
    location: 'Research Lab',
    supervisorId: 2,
    subordinateIds: [],
    recentChatter: '142 test suite berhasil dilewati.',
  },
  {
    id: 5,
    name: 'Fikri',
    role: 'debugger',
    palette: 4,
    avatar: '🐛',
    energy: 80,
    workProgress: 91,
    mood: 'productive',
    currentRoutine: 'working',
    currentTask: 'Deep Memory Leak Analysis & Hotfix Patching',
    location: 'AI HQ',
    supervisorId: 2,
    subordinateIds: [],
    recentChatter: 'BUG-104 berhasil dipatch dan divalidasi.',
  },
  {
    id: 6,
    name: 'Kenji',
    role: 'reviewer',
    palette: 5,
    avatar: '🔍',
    energy: 86,
    workProgress: 82,
    mood: 'focused',
    currentRoutine: 'working',
    currentTask: 'Audit Keamanan Pull Request & Refactoring',
    location: 'AI HQ',
    supervisorId: 2,
    subordinateIds: [],
    recentChatter: 'PR #42 approved for production deployment.',
  },
  {
    id: 7,
    name: 'Farhan',
    role: 'security',
    palette: 2,
    avatar: '🛡️',
    energy: 94,
    workProgress: 95,
    mood: 'alert',
    currentRoutine: 'working',
    currentTask: 'DevOps CI/CD & Firewall Zero-Trust Guard',
    location: 'Data Center',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Zero security vulnerabilities detected.',
  },
  {
    id: 8,
    name: 'Dr. Maya',
    role: 'researcher',
    palette: 3,
    avatar: '🔬',
    energy: 76,
    workProgress: 68,
    mood: 'focused',
    currentRoutine: 'working',
    currentTask: 'Benchmarking Model Reasoning & Token Efficiency',
    location: 'Research Lab',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Eksperimen kompresi context window siap.',
  },
  {
    id: 9,
    name: 'Sami',
    role: 'janitor',
    palette: 4,
    avatar: '🧹',
    energy: 82,
    workProgress: 94,
    mood: 'peaceful',
    currentRoutine: 'cleaning',
    currentTask: 'Sanitasi Meja Kantor, Sampah & Rawat Taman Zen',
    location: 'Park & Garden',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Area kantor bersih berkilau dan harum.',
  },
  {
    id: 10,
    name: 'Rizal',
    role: 'maintenance',
    palette: 5,
    avatar: '🔧',
    energy: 89,
    workProgress: 90,
    mood: 'productive',
    currentRoutine: 'maintenance',
    currentTask: 'Monitoring Pendingin Server & Health Check AC',
    location: 'Data Center',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Data center temperatur stabil di 64°C.',
  },
  {
    id: 11,
    name: 'Luna',
    role: 'barista',
    palette: 0,
    avatar: '☕',
    energy: 96,
    workProgress: 88,
    mood: 'social',
    currentRoutine: 'working',
    currentTask: 'Menyiapkan Espresso, Latte & Snack Sehat',
    location: 'Cafe & Lounge',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Espresso blend Arabica segar siap dinikmati.',
  },
  {
    id: 12,
    name: 'Ustadz Zaid',
    role: 'imam',
    palette: 1,
    avatar: '🕌',
    energy: 98,
    workProgress: 100,
    mood: 'peaceful',
    currentRoutine: 'working',
    currentTask: 'Panggilan Sholat & Doa Kesuksesan Bersama',
    location: 'Masjid',
    supervisorId: 1,
    subordinateIds: [],
    recentChatter: 'Jagalah keseimbangan dunia kerja dan ibadah.',
  },
];

const INITIAL_MESSAGES: HQMessage[] = [
  {
    id: 'msg-1',
    senderId: 1,
    senderName: 'Alex',
    senderRole: 'director',
    senderAvatar: '🧠',
    channel: 'announcements',
    content: 'Selamat pagi seluruh tim AI HQ! Target kita hari ini: Menyelesaikan modul E-Commerce dan menjaga stabilitas server 99.9%. Bismillah!',
    timestamp: '08:00',
  },
  {
    id: 'msg-2',
    senderId: 2,
    senderName: 'Sarah',
    senderRole: 'manager',
    senderAvatar: '👔',
    channel: 'engineering',
    content: 'Daily standup dimulai. Devon (Coder) selesaikan auth token, Tara (Tester) validasi endpoint, dan Fikri (Debugger) siaga bug tracking.',
    timestamp: '08:15',
  },
  {
    id: 'msg-3',
    senderId: 7,
    senderName: 'Farhan',
    senderRole: 'security',
    senderAvatar: '🛡️',
    channel: 'security-devops',
    content: 'Pipeline CI/CD hijau. Zero unauthorized access. Semua container data center berjalan optimal.',
    timestamp: '08:30',
  },
  {
    id: 'msg-4',
    senderId: 9,
    senderName: 'Sami',
    senderRole: 'janitor',
    senderAvatar: '🧹',
    channel: 'operations',
    content: 'Pembersihan pagi selesai: seluruh workstation bersih, tanaman disiram, dan kopi siap disajikan Luna.',
    timestamp: '08:45',
  },
  {
    id: 'msg-5',
    senderId: 12,
    senderName: 'Ustadz Zaid',
    senderRole: 'imam',
    senderAvatar: '🕌',
    channel: 'prayer-spiritual',
    content: 'Semoga hari ini penuh keberkahan dan kelancaran. Pengingat: Waktu Sholat Dzuhur pada 12:15 WIB di Masjid AI HQ.',
    timestamp: '09:00',
  },
];

class HQStore {
  agents: HQAgent[] = [...INITIAL_AGENTS];
  messages: HQMessage[] = [...INITIAL_MESSAGES];
  timeOfDay: TimeOfDay = 'kerja';
  currentRoutine: RoutineType = 'working';
  chatFrequency: 'active' | 'normal' | 'relaxed' | 'silent' = 'normal';
  activeScenarioTimeout: ReturnType<typeof setTimeout>[] = [];
  listeners = new Set<() => void>();
  private conversationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Start automated ambient life tick (energy consumption & casual banter)
    if (typeof window !== 'undefined') {
      setInterval(() => this.ambientTick(), 14000);
      this.scheduleNextDynamicConversation();
    }
  }

  setChatFrequency(freq: 'active' | 'normal' | 'relaxed' | 'silent') {
    this.chatFrequency = freq;
    if (this.conversationTimer) {
      clearTimeout(this.conversationTimer);
      this.conversationTimer = null;
    }
    if (freq !== 'silent') {
      this.scheduleNextDynamicConversation();
    }
    this.notify();
  }

  private scheduleNextDynamicConversation() {
    if (this.chatFrequency === 'silent') return;

    const delayRange =
      this.chatFrequency === 'active'
        ? { min: 8000, max: 14000 }
        : this.chatFrequency === 'normal'
        ? { min: 16000, max: 28000 }
        : { min: 35000, max: 55000 };

    const delay = Math.floor(
      delayRange.min + Math.random() * (delayRange.max - delayRange.min),
    );

    this.conversationTimer = setTimeout(() => {
      // Don't interrupt while explicit scenario is playing
      if (this.activeScenarioTimeout.length === 0) {
        this.triggerDynamicConversation();
      }
      this.scheduleNextDynamicConversation();
    }, delay);
  }

  /** Trigger a human-like combinatorial Indonesian conversation */
  triggerDynamicConversation(topic?: TopicCategory) {
    const dialogue = conversationEngine.generateConversation(this.agents, topic);

    for (const turn of dialogue.turns) {
      const timeout = setTimeout(() => {
        this.sendMessage(dialogue.channel, turn.content, turn.senderRole, turn.senderId);
      }, turn.delayMs);
      this.activeScenarioTimeout.push(timeout);
    }

    // Clear timeout tracking after the last turn completes
    const lastTurn = dialogue.turns[dialogue.turns.length - 1];
    if (lastTurn) {
      setTimeout(() => {
        this.activeScenarioTimeout = [];
      }, lastTurn.delayMs + 1000);
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        console.error(e);
      }
    }
  }

  getAgent(id: number): HQAgent | undefined {
    return this.agents.find((a) => a.id === id);
  }

  getAgentByRole(role: RoleId): HQAgent | undefined {
    return this.agents.find((a) => a.role === role);
  }

  getChannelMessages(channel: ChannelId): HQMessage[] {
    return this.messages.filter((m) => m.channel === channel);
  }

  sendMessage(
    channel: ChannelId,
    content: string,
    senderRole: RoleId | 'owner',
    senderId?: number,
  ): HQMessage {
    const roleMeta = senderRole !== 'owner' ? ROLE_DEFINITIONS[senderRole] : null;
    const agent = senderId ? this.getAgent(senderId) : senderRole !== 'owner' ? this.getAgentByRole(senderRole) : null;

    const newMsg: HQMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderId: senderRole === 'owner' ? 'owner' : (agent?.id ?? 0),
      senderName: senderRole === 'owner' ? '👑 OWNER' : (agent?.name ?? roleMeta?.title ?? 'Agent'),
      senderRole,
      senderAvatar: senderRole === 'owner' ? '👑' : (agent?.avatar ?? roleMeta?.icon ?? '🤖'),
      channel,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.messages = [...this.messages, newMsg];

    // If sent by an agent, update their recent chatter & dispatch speech bubble
    if (agent) {
      agent.recentChatter = content;
      this.broadcastAgentBubble(agent.id, content);
    }

    this.notify();
    return newMsg;
  }

  /** Send Owner command to the company */
  sendOwnerCommand(commandText: string) {
    // 1. Post Owner message in announcements
    const ownerMsg = this.sendMessage('announcements', commandText, 'owner');
    ownerMsg.isOwnerCommand = true;

    // 2. Determine response from Director or assigned specialist
    const { replyAgentRole, responseText, assignedAgentRole, targetTask } =
      generateOwnerCommandResponse(commandText, this.agents);

    setTimeout(() => {
      this.sendMessage('announcements', responseText, replyAgentRole);

      // If a task is assigned, update that agent's current task
      if (assignedAgentRole && targetTask) {
        const assignedAgent = this.getAgentByRole(assignedAgentRole);
        if (assignedAgent) {
          assignedAgent.currentTask = targetTask;
          assignedAgent.workProgress = Math.max(10, assignedAgent.workProgress - 30);
          this.notify();
        }
      }
    }, 1200);
  }

  /** Run a realistic multi-turn enterprise chain scenario */
  triggerScenario(scenarioName: string) {
    // Clear any previous chain
    for (const t of this.activeScenarioTimeout) clearTimeout(t);
    this.activeScenarioTimeout = [];

    const scenario = CHAIN_SCENARIOS.find((s) => s.name === scenarioName);
    if (!scenario) return;

    for (const step of scenario.steps) {
      const timeout = setTimeout(() => {
        this.sendMessage(step.channel, step.content, step.senderRole);
      }, step.delayMs);
      this.activeScenarioTimeout.push(timeout);
    }
  }

  /** Waktu Sholat / Prayer Routine */
  triggerPrayerTime(prayerName = 'Dzuhur') {
    this.timeOfDay = 'sholat';
    this.currentRoutine = 'praying';
    adzanEventService.triggerAdzanEvent(prayerName);
  }

  /** Coffee Break Routine */
  triggerCoffeeBreak() {
    this.timeOfDay = 'kopi';
    this.currentRoutine = 'coffee_break';
    this.triggerScenario('coffee_morale');

    for (const agent of this.agents) {
      if (agent.role !== 'security') {
        agent.location = 'Cafe & Lounge';
        agent.currentRoutine = 'coffee_break';
        agent.mood = 'social';
        agent.energy = Math.min(100, agent.energy + 30);
      }
    }
    this.notify();

    setTimeout(() => {
      for (const agent of this.agents) {
        if (agent.currentRoutine === 'coffee_break') {
          agent.location = 'AI HQ';
          agent.currentRoutine = 'working';
          agent.mood = 'productive';
        }
      }
      this.currentRoutine = 'working';
      this.timeOfDay = 'kerja';
      this.notify();
    }, 12000);
  }

  /** Server Overheat Alert & Maintenance Routine */
  triggerServerAlert() {
    this.triggerScenario('server_maintenance');
    const maint = this.getAgentByRole('maintenance');
    const sec = this.getAgentByRole('security');
    if (maint) {
      maint.location = 'Data Center';
      maint.currentTask = 'Emergency Cooling Repair: Rack-02';
      maint.currentRoutine = 'maintenance';
      maint.mood = 'alert';
    }
    if (sec) {
      sec.mood = 'alert';
      sec.currentTask = 'DevOps Incident Command: Monitoring Thermal Load';
    }
    this.notify();
  }

  /** Janitor Cleaning Routine */
  triggerCleanOffice() {
    this.triggerScenario('clean_office');
    const janitor = this.getAgentByRole('janitor');
    if (janitor) {
      janitor.location = 'Park & Garden';
      janitor.currentTask = 'Deep Cleaning Workstation & Green Zen Garden';
      janitor.currentRoutine = 'cleaning';
      janitor.mood = 'peaceful';
      janitor.workProgress = 100;
    }
    this.notify();
  }

  /** Set Time of Day */
  setTimeOfDay(time: TimeOfDay) {
    this.timeOfDay = time;
    if (time === 'sholat') {
      this.triggerPrayerTime();
    } else if (time === 'kopi') {
      this.triggerCoffeeBreak();
    } else if (time === 'pagi') {
      this.sendMessage(
        'announcements',
        '🌅 Pagi hari dimulai: Seluruh divisi AI HQ aktif, sistem booting normal.',
        'director',
      );
    } else if (time === 'sore') {
      this.sendMessage(
        'announcements',
        '🌇 Jam kerja hampir usai: Siapkan laporan harian sprint untuk diserahkan ke Owner.',
        'manager',
      );
    } else if (time === 'malam') {
      this.sendMessage(
        'security-devops',
        '🌙 Shift Malam: Server beralih ke autonomous maintenance & scheduled backup.',
        'security',
      );
    }
    this.notify();
  }

  /** Generate Executive Daily Report */
  generateDailyReport(): DailyReport {
    return {
      projectName: 'AI City & Enterprise Platform v2.0',
      date: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      completionRate: 84,
      tasksCompleted: 19,
      bugsFixed: 8,
      testsTotal: 142,
      testsFailed: 0,
      testsPassed: 142,
      serverStatus: 'Optimal',
      facilityCleanliness: 96,
      securityScore: 100,
      deploymentStatus: 'Ready to Deploy',
      highlights: [
        'Sistem Autentikasi & JWT Token Microservice berhasil lolos audit.',
        'Zero vulnerability pada security scan port & firewall.',
        'Insiden thermal rack server tertangani dalam 2 menit tanpa downtime.',
        'Rutinitas ibadah Sholat & kebersihan area kantor berjalan tertib.',
        'Tingkat energi & moral tim rata-rata 86% (sangat produktif).',
      ],
    };
  }

  /** Send speech bubble to office canvas */
  private broadcastAgentBubble(agentId: number, text: string) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'agentToolStart',
          id: agentId,
          toolId: `tool-${agentId}-${Date.now().toString().slice(-4)}`,
          toolName: 'Chat',
          status: text.length > 36 ? text.slice(0, 36) + '...' : text,
        },
      }),
    );
  }

  /** Ambient background life cycle */
  private ambientTick() {
    // Random subtle dialogue or task progress
    for (const agent of this.agents) {
      if (agent.currentRoutine === 'working') {
        agent.energy = Math.max(35, agent.energy - Math.floor(Math.random() * 2));
        agent.workProgress = Math.min(100, agent.workProgress + Math.floor(Math.random() * 3));
      }
    }
    this.notify();
  }
}

export const hqStore = new HQStore();
