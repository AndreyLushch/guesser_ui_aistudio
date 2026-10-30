/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { Crown, RotateCcw, LayoutGrid, Award } from 'lucide-react';
import { TeamBadge } from '../components/TeamBadge';
import { calculatePlaces } from '../engine/calculations';
import { haptic } from '../utils/haptics';

interface FinishedScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({
  view,
  send,
  onOpenRules,
}) => {
  const isHost = view.me.isHost;
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  // Standings with proper tied places
  const standings = view.finishedSummary?.teamsSorted || calculatePlaces(view.teams);

  // Check if multiple teams share 1st place
  const firstPlaceTeams = standings.filter((t) => t.place === 1);
  const isTie = firstPlaceTeams.length > 1;

  // Is current viewer in the winning team?
  const isWinner = firstPlaceTeams.some((t) => t.id === view.me.teamId);

  useEffect(() => {
    if (isWinner) {
      haptic('success');
    }
  }, [isWinner]);

  const handlePlayAgain = () => {
    haptic('light');
    send({ type: 'BEGIN_PLAY' });
  };

  const handleBackToLobby = () => {
    haptic('light');
    // Using START_GAME or resetting back
    window.location.reload();
  };

  return (
    <div
      data-testid="guesser-phase-finished"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between"
    >
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between pt-1">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} />
          <button
            onClick={onOpenRules}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center border border-neutral-800"
          >
            ?
          </button>
        </div>

        {/* Hero Celebration Banner */}
        <div className="text-center py-2 space-y-2 relative overflow-hidden">
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute w-2 h-2 rounded-full bg-amber-400 -top-1 left-8 animate-bounce" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 top-4 right-10 animate-pulse" />
            <span className="absolute w-2 h-2 rounded-full bg-cyan-400 bottom-2 left-16 animate-ping" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-purple-400 bottom-4 right-8 animate-bounce" />
          </div>

          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg border border-amber-500/30">
            <Crown className="w-7 h-7" />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isTie ? STRINGS.finished.tieTitle : 'Победители партии'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              {isTie
                ? STRINGS.finished.tieTitle
                : STRINGS.finished.winnerCongrats(firstPlaceTeams[0]?.name || '')}
            </h1>
          </div>
        </div>

        {/* Podium Standings list */}
        <div className="space-y-2">
          {standings.map((team) => {
            const isMyTeam = team.id === view.me.teamId;
            const isTop = team.place === 1;

            return (
              <div
                key={team.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isTop
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-lg'
                    : isMyTeam
                    ? 'border-neutral-500/60 bg-neutral-900/90 ring-1 ring-white/15'
                    : 'border-neutral-800/80 bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Place badge */}
                  <div
                    className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                      team.place === 1
                        ? 'bg-amber-400 text-neutral-950 shadow-md'
                        : team.place === 2
                        ? 'bg-neutral-300 text-neutral-950'
                        : team.place === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {team.place === 1 ? <Crown className="w-4 h-4 fill-current" /> : team.place}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="text-sm font-bold text-white truncate">{team.name}</span>
                      {isMyTeam && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-semibold">
                          Твоя
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {STRINGS.finished.placeBadge(team.place)}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="font-mono font-black text-lg text-white">
                    {team.score}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {STRINGS.finished.scorePoints(team.score)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 space-y-2">
        {isHost ? (
          <>
            <button
              data-testid="guesser-play-again"
              onClick={handlePlayAgain}
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-neutral-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>{STRINGS.finished.playAgain}</span>
            </button>

            <button
              onClick={handleBackToLobby}
              className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{STRINGS.finished.chooseAnotherGame}</span>
            </button>
          </>
        ) : (
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{STRINGS.finished.hostChooses}</span>
          </div>
        )}
      </div>
    </div>
  );
};
