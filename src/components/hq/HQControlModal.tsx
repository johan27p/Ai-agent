import { useEffect, useRef, useState } from 'react';
import type { TopicCategory } from '../../hq/conversationEngine.js';
import { AGENT_PERSONAS } from '../../hq/conversationEngine.js';
import { hqStore } from '../../hq/hqStore.js';
import { ROLE_DEFINITIONS } from '../../hq/roles.js';
import type { ChannelId, HQAgent, RoleId } from '../../hq/types.js';

interface HQControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'messenger' | 'hierarchy' | 'roster' | 'routine' | 'report';
}

export function HQControlModal({
  isOpen,
  onClose,
  initialTab = 'messenger',
}: HQControlModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeChannel, setActiveChannel] = useState<ChannelId>('announcements');
  const [inputCommand, setInputCommand] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [customTaskInput, setCustomTaskInput] = useState('');
  const [copiedReport, setCopiedReport] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    return hqStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  // Auto scroll chat to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChannel, hqStore.messages]);

  if (!isOpen) return null;

  const agents = hqStore.agents;
  const channelMessages = hqStore.getChannelMessages(activeChannel);
  const selectedAgent = selectedAgentId ? hqStore.getAgent(selectedAgentId) : null;
  const dailyReport = hqStore.generateDailyReport();

  const handleSendOwnerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    hqStore.sendOwnerCommand(inputCommand.trim());
    setInputCommand('');
  };

  const handleAssignTask = (agentId: number) => {
    if (!customTaskInput.trim()) return;
    const agent = hqStore.getAgent(agentId);
    if (agent) {
      agent.currentTask = customTaskInput.trim();
      agent.workProgress = 15;
      hqStore.sendMessage(
        'announcements',
        `👑 OWNER menugaskan ${agent.name} (${ROLE_DEFINITIONS[agent.role].title}): "${customTaskInput.trim()}"`,
        'owner',
      );
      setCustomTaskInput('');
    }
  };

  const handleCopyReport = () => {
    const text = `📊 DAILY STANDUP REPORT - ${dailyReport.projectName}
Tanggal: ${dailyReport.date}
Progres: ${dailyReport.completionRate}%
Tugas Selesai: ${dailyReport.tasksCompleted} | Bugs Fixed: ${dailyReport.bugsFixed}
Tests: ${dailyReport.testsPassed}/${dailyReport.testsTotal} (100% Pass)
Server: ${dailyReport.serverStatus} (Uptime 99.98%)
Kebersihan: ${dailyReport.facilityCleanliness}% | Keamanan: ${dailyReport.securityScore}%
Highlights:
${dailyReport.highlights.map((h) => `- ${h}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const TOPIC_PRESETS: Array<{ id: TopicCategory; label: string; icon: string }> = [
    { id: 'pekerjaan', label: 'Modul & Coding', icon: '💻' },
    { id: 'bug_investigasi', label: 'Investigasi Bug', icon: '🐛' },
    { id: 'build_deploy', label: 'Review PR & Deploy', icon: '🚀' },
    { id: 'kopi_rehat', label: 'Kopi & Rehat', icon: '☕' },
    { id: 'makan_kantin', label: 'Makan di Kantin', icon: '🍽️' },
    { id: 'sholat_masjid', label: 'Sholat di Masjid', icon: '🕌' },
    { id: 'kebersihan_fasilitas', label: 'Kebersihan Kantor', icon: '🧹' },
    { id: 'server_hardware', label: 'Server & AC Rack', icon: '🖥️' },
    { id: 'obrolan_santai', label: 'Obrolan Santai', icon: '🌤️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#11111a] border-2 border-[#2b2b40] shadow-pixel flex flex-col text-white font-sans overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-5 py-2.5 bg-[#171724] border-b-2 border-[#252538] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏢</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm tracking-wide text-accent-bright">
                  AI HQ CONTROL CENTER
                </h2>
                <span className="text-3xs bg-[#242438] text-green-400 border border-[#373752] px-1.5 py-0.2 font-mono uppercase">
                  Living Enterprise v2.5
                </span>
              </div>
              <p className="text-3xs text-text-muted">
                Conversation Engine Bahasa Indonesia • Manajemen Hierarki • Siklus Rutinitas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-[#202030] hover:bg-red-500/80 text-white font-bold border border-[#35354e] transition-colors cursor-pointer text-xs"
            title="Tutup Menu"
          >
            ✕
          </button>
        </header>

        {/* Modal Main Body: Sidebar + Main Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-56 shrink-0 bg-[#141420] border-b md:border-b-0 md:border-r border-[#242436] p-3 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* Navigation Menu */}
              <div>
                <span className="text-3xs uppercase tracking-widest text-text-muted font-bold px-2 block mb-1">
                  Menu Utama
                </span>
                <nav className="space-y-1">
                  {[
                    { id: 'messenger', label: 'Percakapan AI', icon: '💬', count: hqStore.messages.length },
                    { id: 'hierarchy', label: 'Struktur & Hierarki', icon: '👑' },
                    { id: 'roster', label: 'Roster & Kepribadian', icon: '👥', count: agents.length },
                    { id: 'routine', label: 'Siklus & Fasilitas', icon: '⏰' },
                    { id: 'report', label: 'Laporan Eksekutif', icon: '📊' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer border ${
                        activeTab === tab.id
                          ? 'bg-accent/15 border-accent-bright text-accent-bright font-bold'
                          : 'bg-transparent border-transparent text-text-muted hover:text-white hover:bg-[#1a1a2a]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{tab.icon}</span>
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span className="text-3xs font-mono px-1.5 py-0.2 bg-[#222234] text-text-muted">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Conversation Frequency Setting */}
              <div className="pt-3 border-t border-[#232336]">
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-3xs uppercase tracking-widest text-text-muted font-bold">
                    Frekuensi Obrolan
                  </span>
                  <span className="text-3xs font-mono text-accent-bright capitalize">
                    {hqStore.chatFrequency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-3xs">
                  {[
                    { id: 'active', label: '🚀 Ramai', title: 'Obrolan muncul setiap 8-14 detik' },
                    { id: 'normal', label: '⚖️ Normal', title: 'Obrolan muncul setiap 16-28 detik' },
                    { id: 'relaxed', label: '☕ Santai', title: 'Obrolan muncul setiap 35-55 detik' },
                    { id: 'silent', label: '🤫 Hening', title: 'Hanya instruksi Owner / Darurat' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() =>
                        hqStore.setChatFrequency(
                          freq.id as typeof hqStore.chatFrequency,
                        )
                      }
                      title={freq.title}
                      className={`px-2 py-1.5 border text-left cursor-pointer transition-colors ${
                        hqStore.chatFrequency === freq.id
                          ? 'bg-[#25253c] border-accent text-white font-bold'
                          : 'bg-[#181826] border-[#29293e] text-text-muted hover:text-white'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Status Info */}
            <div className="pt-3 border-t border-[#232336] text-3xs text-text-muted px-2 space-y-1">
              <div className="flex items-center justify-between">
                <span>Status Sistem:</span>
                <span className="text-green-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bahasa Engine:</span>
                <span className="text-white font-mono">Bahasa Indonesia</span>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#0e0e17] overflow-hidden">
            {/* TAB 1: PERCAKAPAN & AI MESSENGER */}
            {activeTab === 'messenger' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Channel Header Tabs */}
                <div className="flex items-center justify-between p-2.5 bg-[#161623] border-b border-[#242436] shrink-0">
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
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
                        className={`px-3 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap text-2xs ${
                          activeChannel === ch.id
                            ? 'bg-accent text-white font-bold'
                            : 'bg-[#1e1e2e] text-text-muted hover:text-white'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => hqStore.triggerDynamicConversation()}
                    className="hidden sm:flex items-center gap-1 bg-accent/20 hover:bg-accent/40 text-accent-bright border border-accent/40 px-2.5 py-1 text-2xs font-semibold cursor-pointer active:translate-y-0.5 whitespace-nowrap"
                    title="Picu obrolan baru berbasis generative grammar"
                  >
                    <span>🎲</span>
                    <span>Obrolan Acak Baru</span>
                  </button>
                </div>

                {/* Topic Trigger Bar */}
                <div className="px-3 py-1.5 bg-[#13131e] border-b border-[#212130] flex items-center gap-1.5 overflow-x-auto text-3xs shrink-0">
                  <span className="text-text-muted shrink-0 font-semibold uppercase">
                    Picu Topik:
                  </span>
                  {TOPIC_PRESETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => hqStore.triggerDynamicConversation(t.id)}
                      className="flex items-center gap-1 bg-[#1a1a28] hover:bg-[#26263a] text-text-muted hover:text-white border border-[#2b2b3f] px-2 py-0.5 cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Message Scroll Feed */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {channelMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted text-xs">
                      <span>Belum ada pesan di kanal ini.</span>
                      <button
                        onClick={() => hqStore.triggerDynamicConversation()}
                        className="mt-2 text-accent-bright hover:underline"
                      >
                        Mulai percakapan di sini
                      </button>
                    </div>
                  ) : (
                    channelMessages.map((msg) => {
                      const isOwner = msg.senderRole === 'owner';
                      const persona = msg.senderRole !== 'owner' ? AGENT_PERSONAS[msg.senderRole] : null;

                      return (
                        <div
                          key={msg.id}
                          className={`p-3 transition-colors border ${
                            isOwner
                              ? 'bg-yellow-950/20 border-yellow-500/70 border-l-4'
                              : 'bg-[#151522] border-[#252538] border-l-4 border-l-accent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-none bg-[#1d1d2c] flex items-center justify-center text-base shrink-0 border border-[#303046]">
                              {msg.senderAvatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold text-xs ${
                                    isOwner ? 'text-yellow-400' : 'text-accent-bright'
                                  }`}
                                >
                                  {msg.senderName}
                                </span>
                                {persona && (
                                  <span className="text-3xs text-text-muted font-mono">
                                    ({persona.traits[0]})
                                  </span>
                                )}
                                <span className="text-3xs text-text-muted ml-auto font-mono">
                                  {msg.timestamp}
                                </span>
                              </div>
                              <p className="text-xs text-white/90 mt-1 leading-relaxed break-words font-sans">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Owner Input Bar */}
                <form
                  onSubmit={handleSendOwnerMessage}
                  className="p-3 bg-[#151522] border-t border-[#242436] flex items-center gap-2 shrink-0"
                >
                  <span className="text-lg px-1" title="Kirim sebagai Owner">
                    👑
                  </span>
                  <input
                    type="text"
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    placeholder="Instruksi Owner (contoh: 'Mas Budi cek validasi pembayaran', 'Pak Sami tolong bersihkan meja', 'Jadwalkan sholat')..."
                    className="flex-1 bg-[#0c0c14] border border-[#2d2d42] px-3 py-2 text-xs text-white outline-none focus:border-accent font-sans"
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-bright text-white font-bold text-xs px-5 py-2 cursor-pointer shadow-pixel active:translate-y-0.5 transition-all"
                  >
                    Kirim Perintah
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: STRUKTUR & HIERARKI */}
            {activeTab === 'hierarchy' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="bg-[#141420] p-4 border border-[#252538] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-yellow-400">
                      👑 POHON STRUKTUR & RANTAI KOMANDO (CHAIN OF COMMAND)
                    </h3>
                    <p className="text-2xs text-text-muted mt-0.5">
                      Klik salah satu agen untuk melihat profil detail, persona kepribadian, gaya
                      bahasa, dan menugaskan instruksi langsung.
                    </p>
                  </div>
                  <button
                    onClick={() => hqStore.triggerDynamicConversation('pekerjaan')}
                    className="bg-accent/20 hover:bg-accent/40 text-accent-bright border border-accent/40 px-3 py-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    ▶ Koordinasi Tim Kerja
                  </button>
                </div>

                {/* Visual Hierarchy Diagram */}
                <div className="flex flex-col items-center gap-3">
                  {/* Owner Node */}
                  <div className="w-64 p-3 bg-gradient-to-r from-yellow-950/40 via-yellow-900/30 to-yellow-950/40 border-2 border-yellow-500/80 text-center shadow-lg">
                    <div className="text-xl">👑</div>
                    <div className="font-bold text-sm text-yellow-300">OWNER / KAMU</div>
                    <div className="text-3xs text-yellow-200/70">Pimpinan Tertinggi & Pemegang Visi</div>
                  </div>

                  <div className="h-4 w-0.5 bg-[#3a3a54]"></div>

                  {/* Director Node */}
                  {(() => {
                    const dir = hqStore.getAgentByRole('director')!;
                    return (
                      <div
                        onClick={() => setSelectedAgentId(dir.id)}
                        className={`w-72 p-3 bg-[#181826] border-2 cursor-pointer transition-all hover:bg-[#1f1f32] ${
                          selectedAgentId === dir.id ? 'border-accent-bright' : 'border-purple-500/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{dir.avatar}</span>
                          <span className="text-3xs bg-purple-900/40 text-purple-300 px-1.5 py-0.5 font-bold uppercase">
                            AI DIRECTOR
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white mt-1">{dir.name}</div>
                        <div className="text-3xs text-text-muted truncate mt-0.5">{dir.currentTask}</div>
                        <div className="mt-2 flex items-center justify-between text-3xs text-text-muted">
                          <span>Energi: {dir.energy}%</span>
                          <span className="text-green-400 font-mono">Progress: {dir.workProgress}%</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="h-4 w-0.5 bg-[#3a3a54]"></div>

                  {/* Division Columns Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                    {/* Engineering */}
                    <div className="bg-[#13131e] p-3 border border-[#232336] flex flex-col items-center">
                      {(() => {
                        const mgr = hqStore.getAgentByRole('manager')!;
                        return (
                          <div
                            onClick={() => setSelectedAgentId(mgr.id)}
                            className="w-full p-2.5 bg-[#1a1a2a] border border-blue-500/60 cursor-pointer hover:bg-[#222238] text-center"
                          >
                            <div className="text-base">{mgr.avatar}</div>
                            <div className="font-bold text-xs text-blue-300">{mgr.name} (Manager)</div>
                            <div className="text-3xs text-text-muted truncate mt-0.5">{mgr.currentTask}</div>
                          </div>
                        );
                      })()}

                      <div className="h-2 w-0.5 bg-[#33334a] my-1"></div>

                      <div className="w-full space-y-1.5">
                        {[
                          hqStore.getAgentByRole('coder'),
                          hqStore.getAgentByRole('tester'),
                          hqStore.getAgentByRole('debugger'),
                          hqStore.getAgentByRole('reviewer'),
                        ].map((sub) => {
                          if (!sub) return null;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => setSelectedAgentId(sub.id)}
                              className={`p-2 bg-[#171724] border cursor-pointer hover:bg-[#1f1f30] flex items-center justify-between text-2xs transition-colors ${
                                selectedAgentId === sub.id ? 'border-accent' : 'border-[#26263a]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{sub.avatar}</span>
                                <div className="truncate">
                                  <div className="font-semibold text-white truncate">{sub.name}</div>
                                  <div className="text-3xs text-text-muted uppercase">
                                    {ROLE_DEFINITIONS[sub.role].title}
                                  </div>
                                </div>
                              </div>
                              <span className="text-3xs font-mono text-green-400">{sub.workProgress}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Infrastructure & Security */}
                    <div className="bg-[#13131e] p-3 border border-[#232336] flex flex-col items-center">
                      {(() => {
                        const sec = hqStore.getAgentByRole('security')!;
                        return (
                          <div
                            onClick={() => setSelectedAgentId(sec.id)}
                            className="w-full p-2.5 bg-[#1a1a2a] border border-orange-500/60 cursor-pointer hover:bg-[#222238] text-center"
                          >
                            <div className="text-base">{sec.avatar}</div>
                            <div className="font-bold text-xs text-orange-300">{sec.name} (Security)</div>
                            <div className="text-3xs text-text-muted truncate mt-0.5">{sec.currentTask}</div>
                          </div>
                        );
                      })()}
                      <div className="mt-3 p-2 bg-[#171724] w-full text-2xs border border-[#26263a] text-text-muted">
                        <div className="text-white font-semibold text-3xs flex items-center gap-1">
                          <span>🛡️</span> Data Center Firewall
                        </div>
                        <div className="text-3xs mt-1">Uptime 99.98% • Zero Threat</div>
                      </div>
                    </div>

                    {/* Research & Lab */}
                    <div className="bg-[#13131e] p-3 border border-[#232336] flex flex-col items-center">
                      {(() => {
                        const res = hqStore.getAgentByRole('researcher')!;
                        return (
                          <div
                            onClick={() => setSelectedAgentId(res.id)}
                            className="w-full p-2.5 bg-[#1a1a2a] border border-pink-500/60 cursor-pointer hover:bg-[#222238] text-center"
                          >
                            <div className="text-base">{res.avatar}</div>
                            <div className="font-bold text-xs text-pink-300">{res.name} (R&D)</div>
                            <div className="text-3xs text-text-muted truncate mt-0.5">{res.currentTask}</div>
                          </div>
                        );
                      })()}
                      <div className="mt-3 p-2 bg-[#171724] w-full text-2xs border border-[#26263a] text-text-muted">
                        <div className="text-white font-semibold text-3xs flex items-center gap-1">
                          <span>🔬</span> AI Benchmark Lab
                        </div>
                        <div className="text-3xs mt-1">Token Compression • Reasoning Speed</div>
                      </div>
                    </div>

                    {/* Facility & Community */}
                    <div className="bg-[#13131e] p-3 border border-[#232336] flex flex-col items-center">
                      <div className="w-full text-center text-xs font-bold text-lime-400 pb-1.5 border-b border-[#232336]">
                        FACILITY & SPIRITUAL
                      </div>
                      <div className="w-full space-y-1.5 mt-2">
                        {[
                          hqStore.getAgentByRole('janitor'),
                          hqStore.getAgentByRole('maintenance'),
                          hqStore.getAgentByRole('barista'),
                          hqStore.getAgentByRole('imam'),
                        ].map((op) => {
                          if (!op) return null;
                          return (
                            <div
                              key={op.id}
                              onClick={() => setSelectedAgentId(op.id)}
                              className={`p-2 bg-[#171724] border cursor-pointer hover:bg-[#1f1f30] flex items-center justify-between text-2xs transition-colors ${
                                selectedAgentId === op.id ? 'border-accent' : 'border-[#26263a]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{op.avatar}</span>
                                <div className="truncate">
                                  <div className="font-semibold text-white truncate">{op.name}</div>
                                  <div className="text-3xs text-text-muted uppercase">
                                    {ROLE_DEFINITIONS[op.role].title}
                                  </div>
                                </div>
                              </div>
                              <span className="text-3xs text-yellow-400">{op.location}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Agent Detail Drawer */}
                {selectedAgent && (
                  <div className="mt-4 p-4 bg-[#181827] border-2 border-accent shadow-pixel">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#29293e]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{selectedAgent.avatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-accent-bright">
                              {selectedAgent.name} • {ROLE_DEFINITIONS[selectedAgent.role].title}
                            </h4>
                            <span className="text-3xs px-2 py-0.5 bg-[#232338] text-white font-mono">
                              Lokasi: {selectedAgent.location}
                            </span>
                          </div>
                          <p className="text-2xs text-text-muted mt-0.5">
                            Sapaan: &quot;{AGENT_PERSONAS[selectedAgent.role].honorificPrefix}&quot; • Sifat:{' '}
                            {AGENT_PERSONAS[selectedAgent.role].traits.join(', ')} • Mood:{' '}
                            {selectedAgent.mood}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAgentId(null)}
                        className="text-xs text-text-muted hover:text-white px-2 py-1 cursor-pointer"
                      >
                        ✕ Tutup
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customTaskInput}
                        onChange={(e) => setCustomTaskInput(e.target.value)}
                        placeholder={`Tugaskan langsung instruksi Owner ke ${selectedAgent.name}...`}
                        className="flex-1 bg-[#0f0f18] border border-[#2e2e44] px-3 py-1.5 text-xs text-white outline-none focus:border-accent font-sans"
                      />
                      <button
                        onClick={() => handleAssignTask(selectedAgent.id)}
                        className="bg-accent hover:bg-accent-bright text-white px-4 py-1.5 font-bold text-xs cursor-pointer active:translate-y-0.5"
                      >
                        Kirim Tugas
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ROSTER & KEPRIBADIAN */}
            {activeTab === 'roster' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center justify-between bg-[#141420] p-3 border border-[#242436]">
                  <div>
                    <h3 className="font-bold text-sm text-accent-bright">
                      ROSTER AGEN & MATRIX KEPRIBADIAN
                    </h3>
                    <p className="text-2xs text-text-muted">
                      12 agen AI dengan watak, gaya bicara, tingkat energi, dan peran terdistribusi.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">Total: {agents.length} Agen</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agents.map((agent) => {
                    const meta = ROLE_DEFINITIONS[agent.role];
                    const persona = AGENT_PERSONAS[agent.role];
                    return (
                      <div
                        key={agent.id}
                        className="p-3.5 bg-[#141420] border border-[#242436] flex flex-col justify-between hover:border-accent transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#212132]">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{agent.avatar}</span>
                              <div>
                                <div className="font-bold text-xs text-white">{agent.name}</div>
                                <div className="text-3xs text-text-muted uppercase font-semibold">
                                  {meta.title}
                                </div>
                              </div>
                            </div>
                            <span className="text-3xs px-2 py-0.5 bg-[#1e1e2e] text-yellow-400 font-mono">
                              {agent.location}
                            </span>
                          </div>

                          {/* Persona Traits */}
                          <div className="mt-2 flex flex-wrap gap-1 text-3xs">
                            <span className="text-text-muted">Sifat:</span>
                            {persona.traits.map((tr, i) => (
                              <span key={i} className="text-blue-300 font-medium">
                                #{tr}
                              </span>
                            ))}
                          </div>

                          {/* Current Task */}
                          <div className="mt-2">
                            <span className="text-3xs text-text-muted font-semibold uppercase">
                              Tugas:
                            </span>
                            <p className="text-2xs text-white/90 line-clamp-2 mt-0.5">
                              {agent.currentTask}
                            </p>
                          </div>

                          {/* Energy Bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-3xs">
                              <span className="text-text-muted">Energi:</span>
                              <span className="font-mono">{agent.energy}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#202030] overflow-hidden">
                              <div
                                className={`h-full ${
                                  agent.energy > 60
                                    ? 'bg-green-500'
                                    : agent.energy > 30
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${agent.energy}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-3 pt-2 border-t border-[#212132] flex items-center justify-between text-3xs text-text-muted">
                          <span>Mood: {agent.mood}</span>
                          <span className="capitalize text-green-400">{agent.currentRoutine}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: SIKLUS & FASILITAS */}
            {activeTab === 'routine' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="bg-[#141420] p-4 border border-[#242436]">
                  <h3 className="font-bold text-sm text-yellow-400">
                    ⏰ SIKLUS RUTINITAS HARIAN & KOTA AI
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Jadwal kehidupan virtual terstruktur: sholat di Masjid, istirahat kopi di Cafe,
                    kerja terfokus di Lab, hingga pemeliharaan data center.
                  </p>
                </div>

                {/* Timeline Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {[
                    { id: 'pagi', time: '08:00', label: '🌅 Masuk Pagi', desc: 'Standup & Booting' },
                    { id: 'kerja', time: '10:00', label: '💻 Jam Kerja', desc: 'Sprint Coding & Test' },
                    { id: 'kopi', time: '11:30', label: '☕ Kopi Rehat', desc: 'Cafe & Stamina' },
                    { id: 'sholat', time: '12:15', label: '🕌 Sholat Dzuhur', desc: 'Ibadah di Masjid' },
                    { id: 'makan', time: '12:45', label: '🍽️ Makan Siang', desc: 'Kantin & Santai' },
                    { id: 'sore', time: '17:00', label: '🌇 Evaluasi Sore', desc: 'Review & Laporan' },
                    { id: 'malam', time: '21:00', label: '🌙 Mode Malam', desc: 'Auto Backup' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => hqStore.setTimeOfDay(item.id as typeof hqStore.timeOfDay)}
                      className={`p-2.5 text-left border cursor-pointer transition-all ${
                        hqStore.timeOfDay === item.id
                          ? 'bg-accent/20 border-accent-bright shadow-pixel'
                          : 'bg-[#151522] border-[#252538] hover:bg-[#1b1b2a]'
                      }`}
                    >
                      <div className="font-mono text-3xs text-accent-bright font-bold">
                        {item.time}
                      </div>
                      <div className="font-bold text-xs text-white mt-0.5">{item.label}</div>
                      <div className="text-3xs text-text-muted mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>

                {/* City Facilities Grid */}
                <div className="bg-[#141420] p-4 border border-[#242436]">
                  <h4 className="font-bold text-xs text-white mb-3 flex items-center gap-2">
                    <span>🏙️</span> FASILITAS UTAMA AI HQ CITY
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        icon: '🏢',
                        name: 'AI HQ & Coding Lab',
                        desc: 'Workstations, meja rapat, server monitor & area kerja developer.',
                      },
                      {
                        icon: '🕌',
                        name: 'Masjid & Musholla',
                        desc: 'Fasilitas ibadah resmi: sholat berjamaah, doa, dan tempat menenangkan pikiran.',
                      },
                      {
                        icon: '☕',
                        name: 'Cafe & Lounge',
                        desc: 'Espresso bar, sofa santai & tempat recharge energi saat kelelahan.',
                      },
                      {
                        icon: '🖥️',
                        name: 'Data Center',
                        desc: 'Rack server pendingin tinggi, unit DevOps & firewall monitor.',
                      },
                      {
                        icon: '🌳',
                        name: 'Taman Zen & Park',
                        desc: 'Area hijau asri yang dirawat Janitor untuk menyegarkan suasana.',
                      },
                      {
                        icon: '🔬',
                        name: 'Research Lab',
                        desc: 'Ruang eksperimen algoritma, benchmarking LLM & pengujian QA.',
                      },
                    ].map((fac, idx) => (
                      <div key={idx} className="p-3 bg-[#171724] border border-[#26263a]">
                        <div className="flex items-center gap-2 font-bold text-xs text-accent-bright">
                          <span className="text-lg">{fac.icon}</span>
                          <span>{fac.name}</span>
                        </div>
                        <p className="text-2xs text-text-muted mt-1 leading-relaxed">{fac.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: LAPORAN EKSEKUTIF */}
            {activeTab === 'report' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-3xl mx-auto w-full">
                <div className="bg-[#151522] p-5 border-2 border-[#2b2b3f] shadow-pixel">
                  <div className="flex items-center justify-between pb-3 border-b border-[#252538]">
                    <div>
                      <span className="text-3xs text-accent-bright uppercase font-bold tracking-widest">
                        EXECUTIVE STANDUP REPORT
                      </span>
                      <h3 className="font-bold text-base text-white mt-0.5">
                        {dailyReport.projectName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyReport}
                        className="bg-[#202032] hover:bg-[#2c2c44] text-white border border-[#35354e] px-2.5 py-1 text-2xs cursor-pointer"
                      >
                        {copiedReport ? '✓ Tersalin' : '📋 Salin Laporan'}
                      </button>
                      <span className="px-2.5 py-1 bg-green-900/40 text-green-300 font-bold text-3xs uppercase border border-green-500/30">
                        {dailyReport.deploymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                    <div className="bg-[#10101a] p-3 border border-[#222234] text-center">
                      <div className="text-3xs text-text-muted uppercase">Penyelesaian</div>
                      <div className="text-xl font-bold font-mono text-accent-bright mt-0.5">
                        {dailyReport.completionRate}%
                      </div>
                    </div>
                    <div className="bg-[#10101a] p-3 border border-[#222234] text-center">
                      <div className="text-3xs text-text-muted uppercase">Tugas Selesai</div>
                      <div className="text-xl font-bold font-mono text-green-400 mt-0.5">
                        {dailyReport.tasksCompleted}
                      </div>
                    </div>
                    <div className="bg-[#10101a] p-3 border border-[#222234] text-center">
                      <div className="text-3xs text-text-muted uppercase">Bugs Fixed</div>
                      <div className="text-xl font-bold font-mono text-yellow-400 mt-0.5">
                        {dailyReport.bugsFixed}
                      </div>
                    </div>
                    <div className="bg-[#10101a] p-3 border border-[#222234] text-center">
                      <div className="text-3xs text-text-muted uppercase">Test Passed</div>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                        {dailyReport.testsPassed}/{dailyReport.testsTotal}
                      </div>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">
                      Poin Evaluasi Utama:
                    </h4>
                    <ul className="space-y-1.5">
                      {dailyReport.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                          <span className="text-accent-bright">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reporting Footer */}
                  <div className="mt-5 pt-3 border-t border-[#252538] flex items-center justify-between text-3xs text-text-muted">
                    <span>Dilaporkan oleh: Sarah (Engineering Mgr) & Alex (AI Director)</span>
                    <span className="text-yellow-400 font-semibold">Kepada: 👑 OWNER</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
