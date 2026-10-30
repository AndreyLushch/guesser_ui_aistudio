/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, TeamScore } from '../types';
import { STRINGS } from '../texts';
import { WifiOff } from 'lucide-react';

interface ScoreboardProps {
  teams: TeamScore[];
  players: Player[];
  myTeamId?: string;
  currentTeamId?: string;
  isLightMode?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  players,
  myTeamId,
  currentTeamId,
  isLightMode = false,
}) => {
  return (
    <div
      data-testid="guesser-scoreboard"
      className={`w-full rounded-2xl p-2.5 shadow-sm space-y-2 border transition-colors ${
        isLightMode
          ? 'bg-white/95 border-neutral-200 shadow-slate-200/50'
          : 'bg-neutral-900/90 border-neutral-800'
      }`}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {teams.map((team) => {
          const isMyTeam = team.id === myTeamId;
          const isCurrentTurn = team.id === currentTeamId;

          // Find offline players in this team
          const teamPlayers = players.filter((p) => p.teamId === team.id);
          const offlineMembers = teamPlayers.filter((p) => p.isOffline);
          const isEntireTeamOffline =
            teamPlayers.length > 0 && offlineMembers.length === teamPlayers.length;

          return (
            <div
              key={team.id}
              className={`relative rounded-xl p-2.5 transition-all duration-200 border flex flex-col justify-between ${
                isMyTeam
                  ? isLightMode
                    ? 'border-neutral-400 bg-neutral-100 shadow-sm ring-2 ring-neutral-400/30'
                    : 'border-neutral-500/60 shadow-md ring-2 ring-white/20'
                  : isLightMode
                  ? 'border-neutral-200 bg-slate-50/80'
                  : 'border-neutral-800 bg-neutral-950/70'
              } ${isCurrentTurn ? 'ring-2 ring-amber-400 shadow-md' : ''}`}
              style={{
                backgroundColor: isMyTeam
                  ? `${team.color}${isLightMode ? '25' : '30'}`
                  : undefined,
              }}
            >
              {/* Turn indicator badge */}
              {isCurrentTurn && (
                <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[13px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950 shadow-md flex items-center gap-1.5 z-10">
                  <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping" />
                  Ход
                </div>
              )}

              {/* Header: color dot + name + score */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: team.color }}
                  />
                  <span
                    className={`text-sm font-black truncate ${
                      isLightMode ? 'text-neutral-900' : 'text-neutral-100'
                    }`}
                  >
                    {team.name}
                  </span>
                </div>
                <span
                  className={`text-base font-black font-mono tracking-tight shrink-0 ${
                    isLightMode ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {team.score}
                </span>
              </div>

              {/* Offline warning row */}
              {offlineMembers.length > 0 && (
                <div className="mt-1.5 pt-1 border-t border-neutral-300 dark:border-neutral-800 text-[13px] font-semibold text-rose-500 flex items-center gap-1">
                  <WifiOff className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {isEntireTeamOffline
                      ? STRINGS.connection.teamOfflineWarning
                      : STRINGS.connection.offlinePlayers(
                          offlineMembers.map((m) => m.nickname.replace(' (ты)', '')).join(', ')
                        )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
