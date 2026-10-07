export type RoleId =
  | 'owner'
  | 'director'
  | 'manager'
  | 'coder'
  | 'tester'
  | 'debugger'
  | 'reviewer'
  | 'researcher'
  | 'security'
  | 'janitor'
  | 'maintenance'
  | 'barista'
  | 'imam';

export type TimeOfDay = 'pagi' | 'kerja' | 'kopi' | 'sholat' | 'makan' | 'sore' | 'malam';

export type AgentMood = 'productive' | 'tired' | 'peaceful' | 'focused' | 'alert' | 'social';

export type RoutineType =
  | 'working'
  | 'coffee_break'
  | 'praying'
  | 'cleaning'
  | 'maintenance'
  | 'resting'
  | 'reporting'
  | 'emergency';

export type LocationType =
  | 'AI HQ'
  | 'Masjid'
  | 'Data Center'
  | 'Cafe & Lounge'
  | 'Research Lab'
  | 'Park & Garden'
  | 'Maintenance Bay';

export type ChannelId =
  | 'announcements'
  | 'engineering'
  | 'operations'
  | 'prayer-spiritual'
  | 'security-devops';

export interface RoleMeta {
  id: RoleId;
  title: string;
  department: string;
  icon: string;
  badgeColor: string;
  reportsTo: RoleId | null;
  description: string;
}

export interface HQAgent {
  id: number;
  name: string;
  role: RoleId;
  palette: number;
  avatar: string;
  energy: number; // 0 - 100
  workProgress: number; // 0 - 100
  mood: AgentMood;
  currentRoutine: RoutineType;
  currentTask: string;
  location: LocationType;
  currentActivity?: string;
  supervisorId: number | null;
  subordinateIds: number[];
  recentChatter?: string;
  savedState?: string;
}

export interface HQMessage {
  id: string;
  senderId: number | 'owner';
  senderName: string;
  senderRole: RoleId | 'owner';
  senderAvatar: string;
  channel: ChannelId;
  content: string;
  timestamp: string;
  replyToId?: string;
  tag?: string;
  isOwnerCommand?: boolean;
}

export interface DailyReport {
  projectName: string;
  date: string;
  completionRate: number; // percentage
  tasksCompleted: number;
  bugsFixed: number;
  testsTotal: number;
  testsFailed: number;
  testsPassed: number;
  serverStatus: 'Optimal' | 'Warning' | 'Critical';
  facilityCleanliness: number; // percentage
  securityScore: number; // percentage
  deploymentStatus: 'Pending Review' | 'Ready to Deploy' | 'Deployed' | 'Blocked';
  highlights: string[];
}
