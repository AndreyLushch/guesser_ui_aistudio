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

interface ActiveTurnScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const ActiveTurnScreen: React.FC<ActiveTurnScreenProps> = ({
  view,
  send,
  onOpenRules,
}) => {
  const isSpeaker = view.me.isCurrentSpeaker;
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  // State for solo format: modal to pick who guessed
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

  // In solo format, list players other than the speaker
  const otherPlayersInSolo = view.players.filter((p) => p.id !== view.me.playerId);

  return (
    <div
      data-testid="guesser-phase-active_turn"
      className="flex flex-col flex-1 px-4 pb-6 space-y-3.5 max-w-md mx-auto w-full justify-between"
    >
      <div className="space-y-3">
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

        {/* Central Display: Speaker Word vs Listener Placeholder */}
        {isSpeaker ? (
          <div
            className="rounded-3xl p-6 border shadow-xl flex flex-col items-center justify-center min-h-[140px] text-center transition-all relative overflow-hidden"
            style={{
              backgroundColor: currentTeam ? `${currentTeam.color}18` : '#171717',
              borderColor: currentTeam ? `${currentTeam.color}60` : '#262626',
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Твоё слово для объяснения:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight break-words max-w-full leading-tight">
              {taskWord || '—'}
            </div>

            {view.mode === 'sprint' && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300/90 font-semibold">
                <Mic className="w-3.5 h-3.5" />
                <span>Объясняй без остановки!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl p-6 bg-neutral-900/60 border border-neutral-800 text-center flex flex-col items-center justify-center min-h-[140px] space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center animate-pulse">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">
              {STRINGS.activeTurn.speakerExplaining(view.currentSpeakerName || 'Объясняющий')}
            </div>
            <div className="text-xs text-neutral-400 max-w-xs">
              {currentTeam?.name} угадывают вслух! Слово появится на экране только при отметке «Угадали».
            </div>
          </div>
        )}
      </div>

      {/* Speaker Control Buttons */}
      {isSpeaker && (
        <div className="space-y-2 pt-2">
          {/* Main buttons: Guessed & Skip */}
          <div className="grid grid-cols-2 gap-3">
            <button
              data-testid="guesser-skip-task"
              onClick={handleSkipTask}
              className="py-4 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] border border-neutral-700 text-neutral-200 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[56px]"
            >
              <FastForward className="w-5 h-5 text-neutral-400" />
              <span>{STRINGS.activeTurn.skipBtn}</span>
            </button>

            <button
              data-testid="guesser-mark-guessed"
              onClick={handleMarkGuessed}
              className="py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer min-h-[56px]"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{STRINGS.activeTurn.guessedBtn}</span>
            </button>
          </div>

          {/* Sprint: End turn early button */}
          {view.mode === 'sprint' && (
            <button
              data-testid="guesser-next-turn"
              onClick={handleFinishTurnEarly}
              className="w-full py-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{STRINGS.activeTurn.endTurnEarly}</span>
            </button>
          )}
        </div>
      )}

      {/* Solo Format Guesser Picker Modal */}
      {isPickingGuesser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">{STRINGS.activeTurn.whoGuessedTitle}</h3>
              <p className="text-xs text-neutral-400">{STRINGS.activeTurn.whoGuessedPrompt}</p>
            </div>

            <div className="space-y-2">
              {otherPlayersInSolo.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectGuesser(player.id)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] border border-neutral-700 text-white font-bold text-sm flex items-center justify-between transition-all"
                >
                  <span>{player.nickname}</span>
                  <span className="text-xs text-amber-400 font-semibold">+1 очко</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPickingGuesser(false)}
              className="w-full py-2.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
