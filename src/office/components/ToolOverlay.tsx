import { useEffect, useState } from 'react';

import { Button } from '../../components/ui/Button.js';
import { hqStore } from '../../hq/hqStore.js';
import {
  CHARACTER_SITTING_OFFSET_PX,
  CONTEXT_CRITICAL_THRESHOLD,
  CONTEXT_DANGER_THRESHOLD,
  CONTEXT_GAUGE_BG,
  CONTEXT_GAUGE_COLOR_CRITICAL,
  CONTEXT_GAUGE_COLOR_DANGER,
  CONTEXT_GAUGE_COLOR_OK,
  CONTEXT_GAUGE_COLOR_WARN,
  CONTEXT_GAUGE_HEIGHT_PX,
  CONTEXT_GAUGE_WIDTH_PX,
  CONTEXT_WARN_THRESHOLD,
  TEAM_LEAD_COLOR,
  TEAM_ROLE_COLOR,
  TOOL_OVERLAY_VERTICAL_OFFSET,
} from '../../constants.js';
import type { SubagentCharacter } from '../../hooks/useExtensionMessages.js';
import type { OfficeState } from '../engine/officeState.js';
import { overlayProjection } from '../projection.js';
import type { ToolActivity } from '../types.js';
import { CharacterState } from '../types.js';

// Both turn-end states show the green checkmark bubble. A finished turn (Stop)
// shows ONLY the checkmark (the label falls through to its normal idle text);
// going idle waiting on the user (Notification(idle_prompt)) additionally
// surfaces this label. Driven by Character.waitingAwaitingInput.
const WAITING_INPUT_ACTIVITY_TEXT = 'Waiting for input';

type BubbleCategory = 'chat' | 'report' | 'warning' | 'success' | 'error';

function getBubbleCategory(text: string, bubbleType: 'permission' | 'waiting' | null): BubbleCategory {
  const lower = text.toLowerCase();
  if (
    lower.includes('error') ||
    lower.includes('bug') ||
    lower.includes('gagal') ||
    lower.includes('fail') ||
    lower.includes('rusak') ||
    lower.includes('timeout')
  ) {
    return 'error';
  }
  if (
    lower.includes('berhasil') ||
    lower.includes('lolos') ||
    lower.includes('passed') ||
    lower.includes('approved') ||
    lower.includes('alhamdulillah') ||
    lower.includes('stabil') ||
    lower.includes('bersih') ||
    lower.includes('selesai')
  ) {
    return 'success';
  }
  if (
    lower.includes('alert') ||
    lower.includes('panas') ||
    lower.includes('suhu') ||
    lower.includes('overheat') ||
    lower.includes('peringatan') ||
    lower.includes('warning') ||
    bubbleType === 'permission'
  ) {
    return 'warning';
  }
  if (
    lower.includes('lapor') ||
    lower.includes('progress') ||
    lower.includes('commit') ||
    lower.includes('test') ||
    lower.includes('deploy') ||
    lower.includes('query')
  ) {
    return 'report';
  }
  return 'chat';
}

const BUBBLE_THEMES: Record<
  BubbleCategory,
  { bg: string; border: string; text: string; title: string; tail: string; icon: string }
> = {
  chat: {
    bg: 'bg-[#12121c]/95',
    border: 'border-[#3a3a52]',
    text: 'text-[#e2e8f0]',
    title: 'text-[#94a3b8]',
    tail: '#3a3a52',
    icon: '💬',
  },
  report: {
    bg: 'bg-[#0b172a]/95',
    border: 'border-[#2563eb]',
    text: 'text-[#bfdbfe]',
    title: 'text-[#60a5fa]',
    tail: '#2563eb',
    icon: '🔵',
  },
  warning: {
    bg: 'bg-[#221704]/95',
    border: 'border-[#d97706]',
    text: 'text-[#fef08a]',
    title: 'text-[#f59e0b]',
    tail: '#d97706',
    icon: '🟡',
  },
  success: {
    bg: 'bg-[#052212]/95',
    border: 'border-[#16a34a]',
    text: 'text-[#bbf7d0]',
    title: 'text-[#4ade80]',
    tail: '#16a34a',
    icon: '🟢',
  },
  error: {
    bg: 'bg-[#250808]/95',
    border: 'border-[#dc2626]',
    text: 'text-[#fecaca]',
    title: 'text-[#f87171]',
    tail: '#dc2626',
    icon: '🔴',
  },
};

interface ToolOverlayProps {
  officeState: OfficeState;
  agents: number[];
  agentTools: Record<number, ToolActivity[]>;
  subagentTools: Record<number, Record<string, ToolActivity[]>>;
  subagentCharacters: SubagentCharacter[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  panRef: React.RefObject<{ x: number; y: number }>;
  onCloseAgent: (id: number) => void;
  alwaysShowOverlay: boolean;
}

/** Derive a short human-readable activity string from tools/status */
function getActivityText(
  agentId: number,
  agentTools: Record<number, ToolActivity[]>,
  isActive: boolean,
  bubbleType: 'permission' | 'waiting' | null,
  waitingAwaitingInput: boolean,
): string {
  if (bubbleType === 'permission') return 'Needs approval';
  // Only the idle case ("Waiting for input") gets a dedicated label. A finished
  // turn (Stop, waitingAwaitingInput=false) falls through so the checkmark alone
  // signals "done", same as the original behavior.
  if (bubbleType === 'waiting' && waitingAwaitingInput) return WAITING_INPUT_ACTIVITY_TEXT;

  const tools = agentTools[agentId];
  if (tools && tools.length > 0) {
    // Find the latest non-done tool
    const activeTool = [...tools].reverse().find((t) => !t.done);
    if (activeTool) {
      if (activeTool.permissionWait) return 'Needs approval';
      return activeTool.status;
    }
    // All tools done but agent still active (mid-turn) — keep showing last tool status
    if (isActive) {
      const lastTool = tools[tools.length - 1];
      if (lastTool) return lastTool.status;
    }
  }

  return 'Idle';
}

function getFuelColor(ratio: number): string {
  if (ratio >= CONTEXT_CRITICAL_THRESHOLD) return CONTEXT_GAUGE_COLOR_CRITICAL;
  if (ratio >= CONTEXT_DANGER_THRESHOLD) return CONTEXT_GAUGE_COLOR_DANGER;
  if (ratio >= CONTEXT_WARN_THRESHOLD) return CONTEXT_GAUGE_COLOR_WARN;
  return CONTEXT_GAUGE_COLOR_OK;
}

export function ToolOverlay({
  officeState,
  agents,
  agentTools,
  subagentTools,
  subagentCharacters,
  containerRef,
  zoom,
  panRef,
  onCloseAgent,
  alwaysShowOverlay,
}: ToolOverlayProps) {
  const [, setTick] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      setTick((n) => n + 1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const el = containerRef.current;
  if (!el) return null;
  const project = overlayProjection(
    officeState.getLayout(),
    el.getBoundingClientRect(),
    zoom,
    panRef.current,
    window.devicePixelRatio || 1,
  );

  const selectedId = officeState.selectedAgentId;
  const hoveredId = officeState.hoveredAgentId;

  // All character IDs
  const allIds = [...agents, ...subagentCharacters.map((s) => s.id)];

  return (
    <>
      {allIds.map((id) => {
        const ch = officeState.characters.get(id);
        if (!ch) return null;

        const isSelected = selectedId === id;
        const isHovered = hoveredId === id;
        const isSub = ch.isSubagent;

        const hqAgent = hqStore.getAgent(id);
        const hasRecentChat = !!hqAgent?.recentChatter;

        // Clean UI: Do NOT cover characters with useless name labels when idle
        if (!isSelected && !isHovered && !hasRecentChat) return null;

        // Position above character
        const sittingOffset = ch.state === CharacterState.TYPE ? CHARACTER_SITTING_OFFSET_PX : 0;
        const screenX = project.toScreenX(ch.x);
        const screenY = project.toScreenY(ch.y + sittingOffset - TOOL_OVERLAY_VERTICAL_OFFSET);

        // A "Done" agent (finished turn: waiting bubble without awaitingInput)
        // shows ONLY its floating green checkmark bubble, never the label panel
        // (the panel would cover the bubble). Render an empty positioned marker
        // so overlay counts stay stable and hover/select can still bring the
        // panel back. When always-show is off, the early return above already
        // keeps the panel hidden for idle agents.
        const isDone = ch.bubbleType === 'waiting' && !ch.waitingAwaitingInput;
        if (isDone && !isSelected && !isHovered) {
          return (
            <div
              key={id}
              className="absolute"
              style={{ left: screenX, top: screenY, pointerEvents: 'none' }}
              data-testid="agent-overlay"
              data-agent-id={id}
            />
          );
        }

        // Get activity text
        const hasWaitingBubble = ch.bubbleType === 'waiting';
        const subHasPermission = isSub && ch.bubbleType === 'permission';
        let activityText: string;
        if (hasWaitingBubble && ch.waitingAwaitingInput) {
          // Idle, waiting on the user -> dedicated label. A finished turn (Stop)
          // shows only the checkmark and falls through to the normal idle text.
          activityText = WAITING_INPUT_ACTIVITY_TEXT;
        } else if (isSub) {
          if (subHasPermission) {
            activityText = 'Needs approval';
          } else {
            // Hover shows the subtask title; SELECTING the sub reveals its live
            // tool activity (watched sub-agents stream it via subagentToolStart).
            const sub = subagentCharacters.find((s) => s.id === id);
            const rows = sub ? subagentTools[sub.parentAgentId]?.[sub.parentToolId] : undefined;
            const activeRow =
              isSelected && rows ? [...rows].reverse().find((t) => !t.done) : undefined;
            activityText = activeRow?.status ?? (sub?.label || 'Subtask');
          }
        } else {
          activityText = getActivityText(
            id,
            agentTools,
            ch.isActive,
            ch.bubbleType,
            ch.waitingAwaitingInput ?? false,
          );
        }

        if (hqAgent?.recentChatter) {
          activityText = hqAgent.recentChatter;
        } else if (hqAgent?.currentActivity) {
          activityText = hqAgent.currentActivity;
        }

        // Determine dot color
        const tools = agentTools[id];
        const hasPermission = subHasPermission || tools?.some((t) => t.permissionWait && !t.done);
        const hasActiveTools = tools?.some((t) => !t.done);
        const isActive = ch.isActive;
        const hasWaiting = ch.bubbleType === 'waiting';

        let dotColor: string | null = null;
        if (hasPermission || hasWaiting) {
          dotColor = 'var(--color-status-permission)';
        } else if (isActive && hasActiveTools) {
          dotColor = 'var(--color-status-active)';
        }

        // Team info & HQ Role
        const teamRoleLabel = hqAgent
          ? `${hqAgent.avatar} ${hqAgent.name} (${hqAgent.role.toUpperCase()})`
          : ch.isTeamLead
          ? 'LEAD'
          : ch.agentName || null;
        const hasExtraLines = !!(ch.folderName || teamRoleLabel || hqAgent);

        // Context gauge. Every agent gets one — lead, teammate, adopted,
        // headless — as soon as it has taken a turn. Sub-agents never do: they
        // have no session of their own, so contextTokens stays 0.
        const contextRatio = ch.contextTokens / ch.maxContextTokens;
        const showContextGauge = !isSub && ch.contextTokens > 0;

        const category = getBubbleCategory(activityText, ch.bubbleType);
        const theme = BUBBLE_THEMES[category];
        const speakerName = hqAgent ? `${hqAgent.avatar} ${hqAgent.name}` : ch.agentName || (isSub ? 'Subagent' : 'Agent');

        return (
          <div
            key={id}
            className="absolute flex flex-col items-center -translate-x-1/2"
            style={{
              left: screenX,
              top: screenY - 26,
              pointerEvents: isSelected ? 'auto' : 'none',
              opacity: alwaysShowOverlay && !isSelected && !isHovered ? (isSub ? 0.6 : 0.85) : 1,
              zIndex: isSelected ? 42 : 41,
            }}
            data-testid="agent-overlay"
            data-agent-id={id}
          >
            {/* Compact Thin Speech Bubble (100–155px wide, font 10–12px) */}
            <div
              className={`relative flex flex-col w-[130px] max-w-[155px] min-w-[100px] px-2 py-1 shadow-pixel ${theme.bg} border ${theme.border} text-left select-none`}
            >
              {/* Speaker Name Header */}
              <div className="flex items-center justify-between gap-1 pb-0.5 leading-none">
                <span className={`text-[9px] font-bold truncate ${theme.title}`}>
                  {speakerName}
                </span>
                <span className="text-[8px] opacity-75">{theme.icon}</span>
              </div>

              {/* Activity / Chat Text: max 1-2 lines */}
              <div className={`text-[10px] leading-tight font-sans line-clamp-2 ${theme.text}`}>
                {activityText}
              </div>

              {/* Little Speech Tail Pointing Down */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[4px] border-x-transparent border-t-[5px]"
                style={{ borderTopColor: theme.tail }}
              />

              {isSelected && !isSub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseAgent(id);
                  }}
                  title="Close agent"
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] leading-none cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {showContextGauge && (
              <div
                style={{
                  width: CONTEXT_GAUGE_WIDTH_PX,
                  height: CONTEXT_GAUGE_HEIGHT_PX,
                  background: CONTEXT_GAUGE_BG,
                  marginTop: 2,
                }}
                title={`${Math.round(contextRatio * 100)}% context used (${(ch.contextTokens / 1000).toFixed(0)}k of ${(ch.maxContextTokens / 1000).toFixed(0)}k tokens)`}
                data-testid="context-gauge"
                data-context-pct={Math.round(contextRatio * 100)}
              >
                <div
                  style={{
                    width: `${Math.min(contextRatio * 100, 100)}%`,
                    height: '100%',
                    background: getFuelColor(contextRatio),
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
