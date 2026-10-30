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
import { AlertTriangle, Sparkles } from 'lucide-react';
import { haptic } from '../utils/haptics';
import { VisualStyle, getActiveTeamFullBackground } from '../theme/tokens';

interface DisputeWindowScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const DisputeWindowScreen: React.FC<DisputeWindowScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
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

  // Requirement 10: Find who guessed in solo format -> "Угадано: Оля"
  let guessedByPlayerName = '';
  if (view.format === 'solo' && disputeData?.guessedById) {
    const p = view.players.find((player) => player.id === disputeData.guessedById);
    if (p) guessedByPlayerName = p.nickname;
  }

  // Requirement 2: Full team color backdrop saturation!
  const teamBg = getActiveTeamFullBackground(currentTeam?.color, isLightMode);

  const cardBorder =
    visualStyle === 'arcade'
      ? 'border-4 border-neutral-950 bg-white shadow-[6px_6px_0px_#000000] rounded-3xl text-neutral-950'
      : visualStyle === 'glass'
      ? 'bg-white/95 dark:bg-black/50 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl text-neutral-900 dark:text-white'
      : 'bg-white dark:bg-neutral-900 border border-white/20 dark:border-neutral-800 shadow-2xl rounded-3xl text-neutral-900 dark:text-white';

  return (
    <div
      data-testid="guesser-phase-dispute_window"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between transition-colors min-h-[92vh] rounded-3xl p-2"
      style={{
        backgroundColor: teamBg.background,
        color: teamBg.color,
      }}
    >
      <div className="space-y-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between pt-1">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} isLightMode={isLightMode} />
          <button
            onClick={onOpenRules}
            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white font-black text-sm flex items-center justify-center border border-white/30"
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
          isLightMode={isLightMode}
        />

        {/* Scoreboard */}
        <Scoreboard
          teams={view.teams}
          players={view.players}
          myTeamId={view.me.teamId}
          currentTeamId={view.currentTeamId}
          isLightMode={isLightMode}
        />

        {/* 5-second countdown timer */}
        <div className="flex justify-center pt-2">
          <PhaseTimer
            secondsLeft={secondsLeft}
            maxSeconds={5}
            label={STRINGS.dispute.autoAcceptIn(secondsLeft)}
          />
        </div>

        {/* Main Claim Banner Card */}
        <div className={`p-6 text-center space-y-3 ${cardBorder}`}>
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="text-[13px] font-black uppercase tracking-wider text-rose-500">
            {view.format === 'solo' && guessedByPlayerName
              ? `Угадано: ${guessedByPlayerName}`
              : `${currentTeam?.name || 'Команда'} угадали:`}
          </div>

          {/* Large word in dispute window */}
          <div className="text-3xl sm:text-4xl font-black tracking-tight break-words uppercase py-1">
            {wordText}
          </div>

          <p className="text-[13px] font-medium opacity-80 leading-relaxed max-w-xs mx-auto">
            Если было нарушение правил или созвучные однокоренные слова — нажми «Отмена»!
          </p>
        </div>

        {view.format === 'pair' && (
          <div className="p-3 rounded-2xl bg-black/30 border border-white/20 text-[13px] font-bold text-white text-center">
            {STRINGS.dispute.pairNote}
          </div>
        )}
      </div>

      {/* Action: Cancel button */}
      <div className="pt-2">
        <button
          data-testid="guesser-raise-dispute"
          onClick={handleRaiseDispute}
          className={`w-full py-4 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-all cursor-pointer min-h-[56px] ${
            visualStyle === 'arcade'
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-3 border-neutral-950 shadow-[4px_4px_0px_#000000]'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40'
          }`}
        >
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          <span>{STRINGS.dispute.cancelBtn}</span>
        </button>
      </div>
    </div>
  );
};
