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
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  teams,
  players,
  myTeamId,
  currentTeamId,
}) => {
  return (
    <div
      data-testid="guesser-scoreboard"
      className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-2.5 shadow-sm space-y-2"
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
                  ? 'border-neutral-500/50 shadow-md ring-1 ring-white/20'
                  : 'border-neutral-800/80 bg-neutral-950/60'
              } ${isCurrentTurn ? 'ring-2 ring-amber-400/80' : ''}`}
              style={{
                backgroundColor: isMyTeam ? `${team.color}20` : undefined,
              }}
            >
              {/* Turn indicator badge */}
              {isCurrentTurn && (
                <div className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
                  Ход
                </div>
              )}

              {/* Header: color dot + name + score */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-xs font-bold truncate text-neutral-100">
                    {team.name}
                  </span>
                </div>
                <span className="text-sm font-black font-mono tracking-tight text-white shrink-0">
                  {team.score}
                </span>
              </div>

              {/* Offline warning row */}
              {offlineMembers.length > 0 && (
                <div className="mt-1.5 pt-1 border-t border-neutral-800/60 text-[10px] text-red-400/90 flex items-center gap-1">
                  <WifiOff className="w-3 h-3 shrink-0" />
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
