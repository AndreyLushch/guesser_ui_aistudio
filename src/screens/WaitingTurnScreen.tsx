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
import { Eye, Mic, Ear, ShieldCheck, WifiOff } from 'lucide-react';
import { haptic } from '../utils/haptics';
import { VisualStyle, getActiveTeamFullBackground } from '../theme/tokens';

interface WaitingTurnScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const WaitingTurnScreen: React.FC<WaitingTurnScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
}) => {
  const isSpeaker = view.me.isCurrentSpeaker;
  const isMyTeamTurn = view.currentTeamId ? view.me.teamId === view.currentTeamId : false;
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  const speakerPlayer = view.players.find((p) => p.id === view.currentSpeakerId);
  const isSpeakerOffline = speakerPlayer?.isOffline;

  const handleShowTask = () => {
    haptic('light');
    send({ type: 'SHOW_TASK' });
  };

  // Requirement 2: Screen flooded with the active team's vibrant color!
  const teamBg = getActiveTeamFullBackground(currentTeam?.color, isLightMode);

  const cardBorder =
    visualStyle === 'arcade'
      ? 'border-4 border-neutral-950 bg-white shadow-[6px_6px_0px_#000000] rounded-3xl text-neutral-950'
      : visualStyle === 'glass'
      ? 'bg-white/95 dark:bg-black/50 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl text-neutral-900 dark:text-white'
      : 'bg-white dark:bg-neutral-900 border border-white/20 dark:border-neutral-800 shadow-2xl rounded-3xl text-neutral-900 dark:text-white';

  return (
    <div
      data-testid="guesser-phase-waiting_turn"
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

        {/* Speaker Offline Warning */}
        {isSpeakerOffline && (
          <div className="bg-rose-600 border-2 border-white text-white rounded-2xl p-3.5 flex items-center gap-2.5 text-[13px] font-bold shadow-lg">
            <WifiOff className="w-5 h-5 shrink-0" />
            <span>{STRINGS.waitingTurn.speakerOfflineWarning(speakerPlayer.nickname)}</span>
          </div>
        )}

        {/* Main Turn Card */}
        <div className={`p-6 text-center shadow-xl space-y-3 ${cardBorder}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[13px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-md">
            <span
              className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"
            />
            <span>{STRINGS.waitingTurn.title(currentTeam?.name || '')}</span>
          </div>

          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            {STRINGS.waitingTurn.speakerAnnounce(view.currentSpeakerName || 'Объясняющий')}
          </div>

          {/* Role instructions */}
          <div className="pt-2">
            {isSpeaker ? (
              <div className="space-y-1.5">
                <div className="text-rose-500 font-black text-base flex items-center justify-center gap-2">
                  <Mic className="w-5 h-5" />
                  <span>{STRINGS.waitingTurn.youAreSpeaker}</span>
                </div>
                <p className="text-[13px] font-medium opacity-85 max-w-xs mx-auto leading-relaxed">
                  {STRINGS.waitingTurn.speakerInstruction}
                </p>
              </div>
            ) : isMyTeamTurn ? (
              <div className="space-y-1.5 text-emerald-600 dark:text-emerald-400">
                <div className="font-black text-base flex items-center justify-center gap-2">
                  <Ear className="w-5 h-5" />
                  <span>Ход вашей команды!</span>
                </div>
                <p className="text-[13px] font-medium opacity-85 max-w-xs mx-auto leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {STRINGS.waitingTurn.teammatesInstruction}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="font-black text-base flex items-center justify-center gap-2 opacity-90">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Следите за игрой</span>
                </div>
                <p className="text-[13px] font-medium opacity-80 max-w-xs mx-auto leading-relaxed">
                  {STRINGS.waitingTurn.opponentsInstruction(currentTeam?.name || 'соперников')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-2">
        {isSpeaker ? (
          <button
            data-testid="guesser-show-task"
            onClick={handleShowTask}
            className={`w-full py-5 rounded-3xl font-black text-lg tracking-wide flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all cursor-pointer ${
              visualStyle === 'arcade'
                ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 border-4 border-neutral-950 shadow-[6px_6px_0px_#000000]'
                : 'bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-neutral-950 shadow-amber-400/40'
            }`}
          >
            <Eye className="w-7 h-7 stroke-[2.5]" />
            <span>{STRINGS.waitingTurn.showTaskBtn}</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-center text-[13px] font-bold text-white flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>Ждём, пока объясняющий нажмёт «Показать слово»...</span>
          </div>
        )}
      </div>
    </div>
  );
};
