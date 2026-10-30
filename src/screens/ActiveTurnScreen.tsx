/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { ProgressBar } from '../components/ProgressBar';
import { TeamBadge } from '../components/TeamBadge';
import { Scoreboard } from '../components/Scoreboard';
import { PhaseTimer } from '../components/PhaseTimer';
import { SpeakerClaimBadge } from '../components/SpeakerClaimBadge';
import { Check, FastForward, Flag, Mic, Volume2 } from 'lucide-react';
import { haptic } from '../utils/haptics';
import { VisualStyle, getActiveTeamFullBackground } from '../theme/tokens';

interface ActiveTurnScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const ActiveTurnScreen: React.FC<ActiveTurnScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
}) => {
  const isSpeaker = view.me.isCurrentSpeaker;
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  // Solo format state: picker modal
  const [isPickingGuesser, setIsPickingGuesser] = useState(false);

  const handleMarkGuessed = () => {
    haptic('success');
    if (view.format === 'solo') {
      setIsPickingGuesser(true);
    } else {
      send({ type: 'MARK_GUESSED' });
    }
  };

  const handleSelectGuesser = (playerId: string) => {
    haptic('success');
    setIsPickingGuesser(false);
    send({ type: 'MARK_GUESSED', guessedBy: playerId });
  };

  const handleSkipTask = () => {
    haptic('warning');
    send({ type: 'SKIP_TASK' });
  };

  const handleFinishTurnEarly = () => {
    haptic('light');
    send({ type: 'NEXT_TURN' });
  };

  const handleCancelSpeakerClaim = () => {
    haptic('warning');
    send({ type: 'RAISE_DISPUTE' });
  };

  const taskWord = view.currentTask?.text || '';
  const otherPlayersInSolo = view.players.filter((p) => p.id !== view.me.playerId);

  // Requirement 2: Full team color background saturation!
  const teamBg = getActiveTeamFullBackground(currentTeam?.color, isLightMode);

  // Style card variants
  const cardBorder =
    visualStyle === 'arcade'
      ? 'border-4 border-neutral-950 shadow-[6px_6px_0px_#000000] rounded-3xl'
      : visualStyle === 'glass'
      ? 'bg-white/90 dark:bg-black/40 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl'
      : 'bg-white dark:bg-neutral-900 border border-white/20 dark:border-neutral-800 shadow-2xl rounded-3xl';

  return (
    <div
      data-testid="guesser-phase-active_turn"
      className="flex flex-col flex-1 px-4 pb-6 space-y-3.5 max-w-md mx-auto w-full justify-between transition-colors min-h-[92vh] rounded-3xl p-2"
      style={{
        backgroundColor: teamBg.background,
        color: teamBg.color,
      }}
    >
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Requirement 3 for SPEAKER: Fold progress and scores into ONE COMPACT 1-LINE HUD */}
        {isSpeaker ? (
          <div className="w-full bg-black/25 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20 flex items-center justify-between gap-2 text-white">
            {/* Left: Progress info */}
            <div className="flex items-center gap-1.5 text-[13px] font-black shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span>Круг {view.currentCircle}/{view.maxCircles}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-90">{view.wordsLeft} слов</span>
            </div>

            {/* Right: Compact team scores */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {view.teams.map((t) => (
                <div
                  key={t.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[13px] font-bold ${
                    t.id === view.currentTeamId
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'bg-white/15 text-white'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.score}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* For listener: standard team badge + scoreboard */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pt-1">
              <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} isLightMode={isLightMode} />
              <button
                onClick={onOpenRules}
                className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white font-black text-sm flex items-center justify-center border border-white/30 transition-all"
              >
                ?
              </button>
            </div>

            <ProgressBar
              currentCircle={view.currentCircle}
              maxCircles={view.maxCircles}
              wordsLeft={view.wordsLeft}
              totalWordsInitial={view.totalWordsInitial}
              isLightMode={isLightMode}
            />

            <Scoreboard
              teams={view.teams}
              players={view.players}
              myTeamId={view.me.teamId}
              currentTeamId={view.currentTeamId}
              isLightMode={isLightMode}
            />
          </div>
        )}

        {/* Sprint active speaker claim toast/floater */}
        {isSpeaker && view.speakerClaim && (
          <SpeakerClaimBadge
            wordText={view.speakerClaim.wordText}
            secondsLeft={view.speakerClaim.secondsLeft}
            canDispute={view.speakerClaim.canDispute}
            onCancel={handleCancelSpeakerClaim}
          />
        )}

        {/* Timer Bar */}
        <div className="flex justify-center pt-1">
          <PhaseTimer
            secondsLeft={view.timers.roundSecondsLeft}
            isPaused={false}
            isSpeaker={isSpeaker}
            label={view.mode === 'step' ? 'Таймер слова' : 'Таймер спринта'}
            maxSeconds={view.mode === 'step' ? 20 : 60}
          />
        </div>

        {/* Requirement 3: THE WORD IS THE ABSOLUTE CENTERPIECE (минимум 44-56px, по центру) */}
        {isSpeaker ? (
          <div
            className={`flex-1 flex flex-col items-center justify-center p-6 text-center transition-all ${cardBorder} text-neutral-950 dark:text-white my-auto min-h-[220px]`}
          >
            <span className="text-[13px] font-black uppercase tracking-wider text-rose-500 mb-2">
              Твоё слово:
            </span>

            {/* Giant central word: minimum 44px-56px */}
            <div className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight break-words max-w-full leading-none py-2 select-text uppercase">
              {taskWord || '—'}
            </div>

            {view.mode === 'sprint' && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-[13px] text-rose-600 dark:text-rose-300 font-bold">
                <Mic className="w-4 h-4 animate-pulse text-rose-500" />
                <span>Спринт: объясняй без пауз!</span>
              </div>
            )}
          </div>
        ) : (
          /* Listener View (Word is strictly hidden!) */
          <div
            className={`flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 ${cardBorder} text-neutral-900 dark:text-white my-auto min-h-[200px]`}
          >
            <div className="w-14 h-14 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center animate-bounce shadow-md">
              <Volume2 className="w-7 h-7" />
            </div>
            <div className="text-lg font-black tracking-tight">
              {STRINGS.activeTurn.speakerExplaining(view.currentSpeakerName || 'Объясняющий')}
            </div>
            <div className="text-[13px] font-medium opacity-80 max-w-xs leading-relaxed">
              Команда {currentTeam?.name} угадывает вслух! Слово появится на экранах стола только при отметке «Угадали».
            </div>
          </div>
        )}
      </div>

      {/* Speaker Control Buttons: Giant thumb buttons (> 56px high) under thumb */}
      {isSpeaker && (
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-2 gap-3.5">
            {/* Skip Button */}
            <button
              data-testid="guesser-skip-task"
              onClick={handleSkipTask}
              className={`py-4 px-4 rounded-2xl active:scale-[0.97] font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[58px] ${
                visualStyle === 'arcade'
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950 border-3 border-neutral-950 shadow-[4px_4px_0px_#000000]'
                  : 'bg-white/90 hover:bg-white text-neutral-950 border border-white shadow-xl'
              }`}
            >
              <FastForward className="w-5 h-5 text-neutral-700 stroke-[2.5]" />
              <span>{STRINGS.activeTurn.skipBtn}</span>
            </button>

            {/* Guessed Button: High-visibility massive green */}
            <button
              data-testid="guesser-mark-guessed"
              onClick={handleMarkGuessed}
              className={`py-4 px-4 rounded-2xl active:scale-[0.97] text-white font-black text-base flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer min-h-[58px] ${
                visualStyle === 'arcade'
                  ? 'bg-emerald-500 hover:bg-emerald-400 border-3 border-neutral-950 shadow-[4px_4px_0px_#000000]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/40'
              }`}
            >
              <Check className="w-7 h-7 stroke-[3.5]" />
              <span>{STRINGS.activeTurn.guessedBtn}</span>
            </button>
          </div>

          {/* Sprint: End turn early button */}
          {view.mode === 'sprint' && (
            <button
              data-testid="guesser-next-turn"
              onClick={handleFinishTurnEarly}
              className="w-full py-3 rounded-2xl bg-black/30 hover:bg-black/50 border border-white/20 text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4" />
              <span>{STRINGS.activeTurn.endTurnEarly}</span>
            </button>
          )}
        </div>
      )}

      {/* Solo Format Guesser Picker Modal */}
      {isPickingGuesser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 text-neutral-900 dark:text-white"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black">{STRINGS.activeTurn.whoGuessedTitle}</h3>
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                {STRINGS.activeTurn.whoGuessedPrompt}
              </p>
            </div>

            <div className="space-y-2">
              {otherPlayersInSolo.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectGuesser(player.id)}
                  className="w-full py-4 px-4 rounded-2xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 active:scale-[0.98] border border-slate-300 dark:border-neutral-700 font-bold text-sm flex items-center justify-between transition-all"
                >
                  <span>{player.nickname}</span>
                  <span className="text-[13px] text-rose-500 font-black">+1 очко</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPickingGuesser(false)}
              className="w-full py-3 text-[13px] font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
