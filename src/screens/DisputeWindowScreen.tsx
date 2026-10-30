/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { ProgressBar } from '../components/ProgressBar';
import { TeamBadge } from '../components/TeamBadge';
import { Scoreboard } from '../components/Scoreboard';
import { PhaseTimer } from '../components/PhaseTimer';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface DisputeWindowScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const DisputeWindowScreen: React.FC<DisputeWindowScreenProps> = ({
  view,
  send,
  onOpenRules,
}) => {
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);

  const disputeData = view.disputeWindow;
  const wordText = disputeData?.wordText || 'СЛОВО';
  const secondsLeft = disputeData?.secondsLeft ?? view.timers.secondarySecondsLeft ?? 5;

  const handleRaiseDispute = () => {
    haptic('warning');
    send({ type: 'RAISE_DISPUTE' });
  };

  // Find who guessed if in solo format
  let guessedByPlayerName = '';
  if (view.format === 'solo' && disputeData?.guessedById) {
    const p = view.players.find((player) => player.id === disputeData.guessedById);
    if (p) guessedByPlayerName = p.nickname;
  }

  return (
    <div
      data-testid="guesser-phase-dispute_window"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between"
    >
      <div className="space-y-3.5">
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

        {/* Progress bar */}
        <ProgressBar
          currentCircle={view.currentCircle}
          maxCircles={view.maxCircles}
          wordsLeft={view.wordsLeft}
          totalWordsInitial={view.totalWordsInitial}
        />

        {/* Scoreboard */}
        <Scoreboard
          teams={view.teams}
          players={view.players}
          myTeamId={view.me.teamId}
          currentTeamId={view.currentTeamId}
        />

        {/* 5-second countdown timer */}
        <div className="flex justify-center pt-2">
          <PhaseTimer
            secondsLeft={secondsLeft}
            maxSeconds={5}
            label={STRINGS.dispute.autoAcceptIn(secondsLeft)}
          />
        </div>

        {/* Main Claim Banner */}
        <div className="rounded-3xl p-5 border border-emerald-500/40 bg-emerald-950/30 text-center shadow-lg space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {view.format === 'solo' && guessedByPlayerName
              ? `${guessedByPlayerName} угадал:`
              : `${currentTeam?.name || 'Команда'} угадали:`}
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words">
            {wordText}
          </div>

          <p className="text-xs text-neutral-400 pt-1">
            Если было нарушение правил или однокоренные слова — нажми «Отмена» для проверки.
          </p>
        </div>

        {view.format === 'pair' && (
          <div className="p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-800 text-[11px] text-cyan-300 text-center">
            {STRINGS.dispute.pairNote}
          </div>
        )}
      </div>

      {/* Action: Cancel button */}
      <div className="pt-2">
        <button
          data-testid="guesser-raise-dispute"
          onClick={handleRaiseDispute}
          className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition-all cursor-pointer min-h-[52px]"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{STRINGS.dispute.cancelBtn}</span>
        </button>
      </div>
    </div>
  );
};
