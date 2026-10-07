import { useEffect, useRef, useState } from 'react';
import { conversationEngine, type TopicCategory } from '../../hq/conversationEngine.js';
import { hqStore } from '../../hq/hqStore.js';
import { ROLE_DEFINITIONS } from '../../hq/roles.js';
import type { ChannelId, HQAgent, RoleId } from '../../hq/types.js';

interface PurpleAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'manager' | 'chat' | 'taskboard' | 'memory' | 'settings';
}

export function PurpleAIPanel({
  isOpen,
  onClose,
  initialTab = 'manager',
}: PurpleAIPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeChannel, setActiveChannel] = useState<ChannelId>('announcements');
  const [ownerInput, setOwnerInput] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRole, setNewTaskRole] = useState<RoleId>('coder');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    return hqStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollTop = chatBottomRef.current.scrollHeight;
    }
  }, [activeChannel, hqStore.messages]);

  if (!isOpen) return null;

  const agents = hqStore.agents;
  const channelMessages = hqStore.getChannelMessages(activeChannel);
  const selectedAgent = selectedAgentId ? hqStore.getAgent(selectedAgentId) : null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerInput.trim()) return;
    hqStore.sendOwnerCommand(ownerInput.trim());
    setOwnerInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const targetAgent = hqStore.getAgentByRole(newTaskRole);
    if (targetAgent) {
      targetAgent.currentTask = newTaskTitle.trim();
      targetAgent.workProgress = 10;
      hqStore.sendMessage(
        'announcements',
        `📋 [TASK BOARD] 👑 OWNER menugaskan ${targetAgent.name} (${ROLE_DEFINITIONS[targetAgent.role].title}): "${newTaskTitle.trim()}"`,
        'owner',
      );
      setNewTaskTitle('');
    }
  };

  const TOPIC_SHORTCUTS: Array<{ id: TopicCategory; label: string; icon: string }> = [
    { id: 'pekerjaan', label: 'Coding & Modul', icon: '💻' },
    { id: 'bug_investigasi', label: 'Investigasi Bug', icon: '🐛' },
    { id: 'build_deploy', label: 'Review & Deploy', icon: '🚀' },
    { id: 'kopi_rehat', label: 'Kopi & Lounge', icon: '☕' },
    { id: 'sholat_masjid', label: 'Sholat di Masjid', icon: '🕌' },
    { id: 'server_hardware', label: 'Data Center', icon: '🖥️' },
    { id: 'kebersihan_fasilitas', label: 'Janitor Clean', icon: '🧹' },
    { id: 'obrolan_santai', label: 'Obrolan Santai', icon: '🌤️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Dedicated Purple Panel Box */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#100c1a] border-2 border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.25)] flex flex-col text-white font-sans overflow-hidden">
        {/* Purple Panel Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-purple-950/90 via-[#211238] to-purple-950/90 border-b-2 border-purple-500/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🟣</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm tracking-wider text-purple-200 uppercase">
                  PANEL UNGU AI • AI HQ MANAGEMENT
                </h2>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-900/60 text-purple-300 border border-purple-400/40 font-mono">
                  Sistem Otonom
                </span>
              </div>
              <p className="text-[10px] text-purple-300/70">
                Pusat Kontrol AI Manager, Agent Chat, Task Board, AI Memory & Pengaturan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/50 cursor-pointer text-xs font-bold transition-colors"
            title="Tutup Panel Ungu"
          >
            ✕
          </button>
        </div>

        {/* Purple Tabs Navigation */}
        <div className="flex items-center px-4 bg-[#160f26] border-b border-purple-900/50 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'manager', label: '🟣 AI MANAGER', icon: '🧠' },
            { id: 'chat', label: '🟣 AGENT CHAT', icon: '💬' },
            { id: 'taskboard', label: '🟣 TASK BOARD', icon: '📋' },
            { id: 'memory', label: '🟣 AI MEMORY', icon: '💾' },
            { id: 'settings', label: '🟣 SETTINGS', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 font-bold tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap text-xs ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-200 bg-purple-950/50 shadow-inner'
                  : 'border-transparent text-purple-300/60 hover:text-purple-200 hover:bg-purple-950/20'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Purple Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#0d0916]">
          {/* TAB 1: 🟣 AI MANAGER */}
          {activeTab === 'manager' && (
            <div className="space-y-5">
              <div className="bg-[#181026] p-4 border border-purple-800/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-purple-300 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>AI DIRECTOR & MANAGERIAL CHAIN</span>
                  </h3>
                  <p className="text-xs text-purple-300/70 mt-0.5">
                    Orkestrator delegasi tugas dari Owner ke AI Director (Alex), Engineering Manager
                    (Sarah), dan seluruh spesialis divisi.
                  </p>
                </div>
                <button
                  onClick={() => hqStore.triggerDynamicConversation('pekerjaan')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 text-xs font-bold border border-purple-400 cursor-pointer active:translate-y-0.5"
                >
                  ▶ Sinkronisasi Tim
                </button>
              </div>

              {/* Managerial Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Director Card */}
                {(() => {
                  const dir = hqStore.getAgentByRole('director')!;
                  return (
                    <div
                      onClick={() => setSelectedAgentId(dir.id)}
                      className="p-4 bg-[#170e28] border-2 border-purple-500/70 cursor-pointer hover:border-purple-400 transition-all shadow-md"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-purple-900/60">
                        <span className="text-2xl">{dir.avatar}</span>
                        <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 font-bold uppercase">
                          AI DIRECTOR
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-2">{dir.name}</h4>
                      <p className="text-xs text-purple-300/80 mt-1">{dir.currentTask}</p>
                      <div className="mt-3 flex items-center justify-between text-2xs text-purple-400 font-mono">
                        <span>Energi: {dir.energy}%</span>
                        <span>Progress: {dir.workProgress}%</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Manager Card */}
                {(() => {
                  const mgr = hqStore.getAgentByRole('manager')!;
                  return (
                    <div
                      onClick={() => setSelectedAgentId(mgr.id)}
                      className="p-4 bg-[#170e28] border-2 border-blue-500/70 cursor-pointer hover:border-blue-400 transition-all shadow-md"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-purple-900/60">
                        <span className="text-2xl">{mgr.avatar}</span>
                        <span className="text-[10px] bg-blue-900/80 text-blue-300 px-2 py-0.5 font-bold uppercase">
                          ENG MANAGER
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-2">{mgr.name}</h4>
                      <p className="text-xs text-purple-300/80 mt-1">{mgr.currentTask}</p>
                      <div className="mt-3 flex items-center justify-between text-2xs text-blue-400 font-mono">
                        <span>Energi: {mgr.energy}%</span>
                        <span>Progress: {mgr.workProgress}%</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Security Card */}
                {(() => {
                  const sec = hqStore.getAgentByRole('security')!;
                  return (
                    <div
                      onClick={() => setSelectedAgentId(sec.id)}
                      className="p-4 bg-[#170e28] border-2 border-orange-500/70 cursor-pointer hover:border-orange-400 transition-all shadow-md"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-purple-900/60">
                        <span className="text-2xl">{sec.avatar}</span>
                        <span className="text-[10px] bg-orange-900/80 text-orange-300 px-2 py-0.5 font-bold uppercase">
                          DEVOPS LEAD
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-2">{sec.name}</h4>
                      <p className="text-xs text-purple-300/80 mt-1">{sec.currentTask}</p>
                      <div className="mt-3 flex items-center justify-between text-2xs text-orange-400 font-mono">
                        <span>Energi: {sec.energy}%</span>
                        <span>Progress: {sec.workProgress}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Direct Delegation to Selected Agent */}
              {selectedAgent && (
                <div className="p-4 bg-[#1c122e] border-2 border-purple-400 shadow-pixel animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedAgent.avatar}</span>
                      <span className="font-bold text-sm text-purple-200">
                        Delegasi Tugas ke {selectedAgent.name} ({ROLE_DEFINITIONS[selectedAgent.role].title})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedAgentId(null)}
                      className="text-xs text-purple-400 hover:text-white"
                    >
                      ✕ Tutup
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder={`Instruksi baru dari Owner untuk ${selectedAgent.name}...`}
                      className="flex-1 bg-[#100a1c] border border-purple-700/60 px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val.trim()) {
                            selectedAgent.currentTask = val.trim();
                            hqStore.sendMessage(
                              'announcements',
                              `👑 OWNER menugaskan ${selectedAgent.name}: "${val.trim()}"`,
                              'owner',
                            );
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector<HTMLInputElement>(
                          'input[placeholder*="Instruksi baru"]',
                        );
                        if (input && input.value.trim()) {
                          selectedAgent.currentTask = input.value.trim();
                          hqStore.sendMessage(
                            'announcements',
                            `👑 OWNER menugaskan ${selectedAgent.name}: "${input.value.trim()}"`,
                            'owner',
                          );
                          input.value = '';
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 text-xs font-bold cursor-pointer"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 🟣 AGENT CHAT */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[66vh] bg-[#120c1e] border border-purple-900/60">
              {/* Channel Tabs */}
              <div className="flex items-center gap-1.5 p-2 bg-[#1b122c] border-b border-purple-900/60 overflow-x-auto text-xs shrink-0">
                {(
                  [
                    { id: 'announcements', label: '📢 #announcements' },
                    { id: 'engineering', label: '💻 #engineering' },
                    { id: 'operations', label: '🧹 #operations' },
                    { id: 'prayer-spiritual', label: '🕌 #prayer-spiritual' },
                    { id: 'security-devops', label: '🛡️ #security-devops' },
                  ] as const
                ).map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`px-3 py-1 font-bold text-2xs cursor-pointer whitespace-nowrap transition-colors ${
                      activeChannel === ch.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#26183e] text-purple-300 hover:text-white'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>

              {/* Topic Shortcuts Bar */}
              <div className="px-3 py-1.5 bg-[#160d26] border-b border-purple-950 flex items-center gap-1.5 overflow-x-auto text-3xs shrink-0">
                <span className="text-purple-400 font-bold uppercase shrink-0">
                  Picu Obrolan:
                </span>
                {TOPIC_SHORTCUTS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => hqStore.triggerDynamicConversation(t.id)}
                    className="flex items-center gap-1 bg-[#22143b] hover:bg-purple-700 text-purple-200 border border-purple-800/60 px-2 py-0.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Messages Stream */}
              <div ref={chatBottomRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {channelMessages.map((msg) => {
                  const isOwner = msg.senderRole === 'owner';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 border text-left ${
                        isOwner
                          ? 'bg-yellow-950/25 border-yellow-500/80 border-l-4'
                          : 'bg-[#180f28] border-purple-900/60 border-l-4 border-l-purple-500'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg">{msg.senderAvatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-xs ${
                                isOwner ? 'text-yellow-400' : 'text-purple-300'
                              }`}
                            >
                              {msg.senderName}
                            </span>
                            <span className="text-3xs uppercase font-mono px-1.5 py-0.2 bg-purple-950 text-purple-400">
                              {msg.senderRole}
                            </span>
                            <span className="text-3xs text-purple-400/60 ml-auto font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-white/90 mt-1 leading-relaxed break-words">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Owner Input Bar */}
              <form
                onSubmit={handleSendChat}
                className="p-3 bg-[#19102b] border-t border-purple-900/60 flex items-center gap-2 shrink-0"
              >
                <span className="text-lg">👑</span>
                <input
                  type="text"
                  value={ownerInput}
                  onChange={(e) => setOwnerInput(e.target.value)}
                  placeholder="Ketik pesan Owner ke seluruh AI HQ..."
                  className="flex-1 bg-[#0f091a] border border-purple-800/80 px-3 py-2 text-xs text-white outline-none focus:border-purple-400 font-sans"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2 cursor-pointer shadow-pixel"
                >
                  Kirim
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: 🟣 TASK BOARD */}
          {activeTab === 'taskboard' && (
            <div className="space-y-4">
              {/* Task Creation Bar */}
              <form
                onSubmit={handleCreateTask}
                className="bg-[#170e28] p-3 border border-purple-800 flex flex-col sm:flex-row items-center gap-2"
              >
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Buat tugas baru untuk ditugaskan ke agent..."
                  className="flex-1 bg-[#0f091a] border border-purple-700/60 px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400 font-sans"
                />
                <select
                  value={newTaskRole}
                  onChange={(e) => setNewTaskRole(e.target.value as RoleId)}
                  className="bg-[#24153d] border border-purple-700 px-3 py-1.5 text-xs text-purple-200 outline-none cursor-pointer"
                >
                  <option value="coder">👨‍💻 Coder (Devon)</option>
                  <option value="tester">🧪 QA Tester (Tara)</option>
                  <option value="debugger">🐛 Debugger (Fikri)</option>
                  <option value="reviewer">🔍 Reviewer (Kenji)</option>
                  <option value="security">🛡️ Security (Farhan)</option>
                  <option value="janitor">🧹 Janitor (Sami)</option>
                  <option value="maintenance">🔧 Maintenance (Rizal)</option>
                </select>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-1.5 cursor-pointer whitespace-nowrap"
                >
                  + Tambah Task
                </button>
              </form>

              {/* Task Cards Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Column 1: Active Tasks */}
                <div className="bg-[#150d24] p-3 border border-purple-900/70">
                  <div className="font-bold text-xs text-purple-300 pb-2 border-b border-purple-900/60 flex items-center justify-between">
                    <span>⚡ IN PROGRESS</span>
                    <span className="font-mono text-3xs">
                      {agents.filter((a) => a.workProgress < 100).length} Tasks
                    </span>
                  </div>
                  <div className="space-y-2 mt-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="p-2.5 bg-[#1d1230] border border-purple-800/50 text-left"
                      >
                        <div className="flex items-center justify-between text-2xs">
                          <span className="font-bold text-purple-200 flex items-center gap-1">
                            <span>{agent.avatar}</span>
                            <span>{agent.name}</span>
                          </span>
                          <span className="text-3xs font-mono text-green-400">
                            {agent.workProgress}%
                          </span>
                        </div>
                        <p className="text-xs text-white/90 mt-1 line-clamp-2">{agent.currentTask}</p>
                        <div className="w-full h-1 bg-[#10091c] mt-2 overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${agent.workProgress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Code & QA Pipeline */}
                <div className="bg-[#150d24] p-3 border border-purple-900/70">
                  <div className="font-bold text-xs text-blue-300 pb-2 border-b border-purple-900/60 flex items-center justify-between">
                    <span>🧪 QA & TESTING PIPELINE</span>
                    <span className="font-mono text-3xs">142 Test Suites</span>
                  </div>
                  <div className="space-y-2 mt-3 text-2xs">
                    <div className="p-2.5 bg-[#1d1230] border border-blue-900/60">
                      <div className="font-bold text-blue-300">Auth Token Regression Suite</div>
                      <div className="text-3xs text-text-muted mt-0.5">Status: 42/42 Passed · 0 Error</div>
                    </div>
                    <div className="p-2.5 bg-[#1d1230] border border-blue-900/60">
                      <div className="font-bold text-blue-300">Payment Gateway Edge Case Suite</div>
                      <div className="text-3xs text-text-muted mt-0.5">Status: Validasi Nominal Fixed</div>
                    </div>
                    <div className="p-2.5 bg-[#1d1230] border border-blue-900/60">
                      <div className="font-bold text-blue-300">Zero-Trust Firewall Audit</div>
                      <div className="text-3xs text-text-muted mt-0.5">Status: Verified by Farhan</div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Facility & Maintenance Status */}
                <div className="bg-[#150d24] p-3 border border-purple-900/70">
                  <div className="font-bold text-xs text-lime-300 pb-2 border-b border-purple-900/60 flex items-center justify-between">
                    <span>🏢 FACILITY & OPERATIONS</span>
                    <span className="font-mono text-3xs">100% Clean</span>
                  </div>
                  <div className="space-y-2 mt-3 text-2xs">
                    <div className="p-2.5 bg-[#1d1230] border border-lime-900/60">
                      <div className="font-bold text-lime-300">Kebersihan Meja & Lab</div>
                      <div className="text-3xs text-text-muted mt-0.5">Janitor Sami: Sanitasi Selesai</div>
                    </div>
                    <div className="p-2.5 bg-[#1d1230] border border-lime-900/60">
                      <div className="font-bold text-lime-300">Data Center Cooling Rack-02</div>
                      <div className="text-3xs text-text-muted mt-0.5">Rizal: Suhu stabil di 64°C</div>
                    </div>
                    <div className="p-2.5 bg-[#1d1230] border border-lime-900/60">
                      <div className="font-bold text-lime-300">Jadwal Sholat di Masjid</div>
                      <div className="text-3xs text-text-muted mt-0.5">Ustadz Zaid: Terjadwal Tepat Waktu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 🟣 AI MEMORY */}
          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="bg-[#181026] p-4 border border-purple-800">
                <h3 className="font-bold text-sm text-purple-300">
                  💾 AI CONVERSATION & STATE MEMORY
                </h3>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  Setiap agent menyimpan state pekerjaan terakhir, riwayat obrolan terbaru, dan
                  checkpoint saat meninggalkan workstation (misal ke Masjid atau Cafe).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 bg-[#150d24] border border-purple-900/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-purple-900/50">
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>{agent.avatar}</span>
                          <span>{agent.name}</span>
                        </span>
                        <span className="text-3xs font-mono text-purple-300 uppercase">
                          {agent.role}
                        </span>
                      </div>
                      <div className="mt-2 text-2xs space-y-1">
                        <div>
                          <span className="text-purple-400 font-semibold">Tugas Terakhir:</span>{' '}
                          <span className="text-white/90">{agent.currentTask}</span>
                        </div>
                        {agent.recentChatter && (
                          <div>
                            <span className="text-purple-400 font-semibold">Obrolan Terakhir:</span>{' '}
                            <span className="text-purple-200/80 italic">
                              &quot;{agent.recentChatter}&quot;
                            </span>
                          </div>
                        )}
                        {agent.savedState && (
                          <div>
                            <span className="text-emerald-400 font-semibold">Saved Checkpoint:</span>{' '}
                            <span className="text-emerald-200 font-mono text-3xs">
                              {agent.savedState}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-purple-900/40 text-3xs text-purple-400/80 flex items-center justify-between">
                      <span>Lokasi: {agent.location}</span>
                      <span>Mood: {agent.mood}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 🟣 SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-[#170e28] p-4 border border-purple-800">
                <h3 className="font-bold text-sm text-purple-300">
                  ⚙️ PENGATURAN ENGINE & BEHAVIOR
                </h3>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  Konfigurasi frekuensi percakapan, otomatisasi AI, dan regenerasi stamina tim.
                </p>
              </div>

              <div className="bg-[#150d24] p-4 border border-purple-900/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">Frekuensi Percakapan</div>
                    <div className="text-3xs text-purple-300/70">
                      Mengatur seberapa sering dialog antar-agent muncul secara alami
                    </div>
                  </div>
                  <select
                    value={hqStore.chatFrequency}
                    onChange={(e) =>
                      hqStore.setChatFrequency(e.target.value as typeof hqStore.chatFrequency)
                    }
                    className="bg-[#26153e] border border-purple-700 px-3 py-1 text-xs text-purple-200 outline-none"
                  >
                    <option value="active">🚀 Ramai (8–14s)</option>
                    <option value="normal">⚖️ Normal (16–28s)</option>
                    <option value="relaxed">☕ Santai (35–55s)</option>
                    <option value="silent">🤫 Hening (Manual Only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-900/50">
                  <div>
                    <div className="font-bold text-xs text-white">Bahasa Percakapan</div>
                    <div className="text-3xs text-purple-300/70">
                      Standar Bahasa Indonesia natural dengan sapaan sopan & terminologi kerja
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-300">Bahasa Indonesia</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-900/50">
                  <div>
                    <div className="font-bold text-xs text-white">Hemat Token & Efisiensi</div>
                    <div className="text-3xs text-purple-300/70">
                      Behavior tree & generative grammar lokal (0 LLM cost untuk obrolan santai)
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400">AKTIF (0 Cost)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
