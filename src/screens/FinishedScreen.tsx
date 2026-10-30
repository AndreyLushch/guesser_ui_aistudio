/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { Crown, RotateCcw, LayoutGrid } from 'lucide-react';
import { TeamBadge } from '../components/TeamBadge';
import { calculatePlaces } from '../engine/calculations';
import { haptic } from '../utils/haptics';
import { VisualStyle } from '../theme/tokens';

interface FinishedScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const FinishedScreen: React.FC<FinishedScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
}) => {
  const isHost = view.me.isHost;
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  const standings = view.finishedSummary?.teamsSorted || calculatePlaces(view.teams);
  const firstPlaceTeams = standings.filter((t) => t.place === 1);
  const isTie = firstPlaceTeams.length > 1;
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
    window.location.reload();
  };

  return (
    <div
      data-testid="guesser-phase-finished"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between transition-colors"
    >
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between pt-1">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} isLightMode={isLightMode} />
          <button
            onClick={onOpenRules}
            className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${
              isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 text-neutral-800 border-slate-300'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
            }`}
          >
            ?
          </button>
        </div>

        {/* Hero Celebration Banner */}
        <div className="text-center py-2 space-y-2 relative overflow-hidden">
          {/* Confetti particles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 -top-1 left-8 animate-bounce" />
            <span className="absolute w-3 h-3 rounded-full bg-rose-500 top-4 right-10 animate-pulse" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 bottom-2 left-16 animate-ping" />
            <span className="absolute w-3 h-3 rounded-full bg-purple-500 bottom-4 right-8 animate-bounce" />
          </div>

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Crown className="w-8 h-8" />
          </div>

          <div>
            <div className="text-[13px] font-black uppercase tracking-wider text-rose-500">
              {isTie ? STRINGS.finished.tieTitle : 'Победители партии'}
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight mt-0.5 ${
                isLightMode ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {isTie
                ? STRINGS.finished.tieTitle
                : STRINGS.finished.winnerCongrats(firstPlaceTeams[0]?.name || '')}
            </h1>
          </div>
        </div>

        {/* Podium Standings list */}
        <div className="space-y-2.5">
          {standings.map((team) => {
            const isMyTeam = team.id === view.me.teamId;
            const isTop = team.place === 1;

            return (
              <div
                key={team.id}
                className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  isTop
                    ? isLightMode
                      ? 'border-amber-400 bg-amber-50/90 shadow-md ring-2 ring-amber-400/30'
                      : 'border-amber-500/80 bg-amber-950/30 shadow-xl ring-2 ring-amber-500/20'
                    : isMyTeam
                    ? isLightMode
                      ? 'border-neutral-400 bg-white shadow-sm ring-2 ring-neutral-400/20'
                      : 'border-neutral-500/60 bg-neutral-900/90 ring-2 ring-white/10'
                    : isLightMode
                    ? 'border-slate-200 bg-white'
                    : 'border-neutral-800/80 bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Place badge */}
                  <div
                    className={`w-9 h-9 rounded-2xl font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-sm ${
                      team.place === 1
                        ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-white'
                        : team.place === 2
                        ? 'bg-slate-300 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                        : team.place === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'
                    }`}
                  >
                    {team.place === 1 ? <Crown className="w-5 h-5 fill-current" /> : team.place}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: team.color }}
                      />
                      <span
                        className={`text-base font-black truncate ${
                          isLightMode ? 'text-neutral-900' : 'text-white'
                        }`}
                      >
                        {team.name}
                      </span>
                      {isMyTeam && (
                        <span className="text-[13px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold shadow-xs">
                          Твоя
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[13px] font-bold ${
                        isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                      }`}
                    >
                      {STRINGS.finished.placeBadge(team.place)}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div
                    className={`font-mono font-black text-xl ${
                      isLightMode ? 'text-neutral-950' : 'text-white'
                    }`}
                  >
                    {team.score}
                  </div>
                  <div
                    className={`text-[13px] font-medium ${
                      isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    {STRINGS.finished.scorePoints(team.score)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 space-y-2.5">
        {isHost ? (
          <>
            <button
              data-testid="guesser-play-again"
              onClick={handlePlayAgain}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 active:scale-[0.98] text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>{STRINGS.finished.playAgain}</span>
            </button>

            <button
              onClick={handleBackToLobby}
              className={`w-full py-3.5 rounded-2xl border font-black text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isLightMode
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-neutral-800'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{STRINGS.finished.chooseAnotherGame}</span>
            </button>
          </>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center text-[13px] font-bold flex items-center justify-center gap-2 ${
              isLightMode
                ? 'bg-white border-slate-200 text-neutral-700'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>{STRINGS.finished.hostChooses}</span>
          </div>
        )}
      </div>
    </div>
  );
};
