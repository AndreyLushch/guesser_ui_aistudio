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

interface WaitingTurnScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const WaitingTurnScreen: React.FC<WaitingTurnScreenProps> = ({
  view,
  send,
  onOpenRules,
}) => {
  const isSpeaker = view.me.isCurrentSpeaker;
  const isMyTeamTurn = view.currentTeamId ? view.me.teamId === view.currentTeamId : false;
  const currentTeam = view.teams.find((t) => t.id === view.currentTeamId);
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  // Check if current speaker is offline
  const speakerPlayer = view.players.find((p) => p.id === view.currentSpeakerId);
  const isSpeakerOffline = speakerPlayer?.isOffline;

  const handleShowTask = () => {
    haptic('light');
    send({ type: 'SHOW_TASK' });
  };

  return (
    <div
      data-testid="guesser-phase-waiting_turn"
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

        {/* Speaker Offline Warning */}
        {isSpeakerOffline && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-red-200">
            <WifiOff className="w-5 h-5 text-red-400 shrink-0" />
            <span>{STRINGS.waitingTurn.speakerOfflineWarning(speakerPlayer.nickname)}</span>
          </div>
        )}

        {/* Main Turn Card */}
        <div
          className="rounded-3xl p-5 border text-center shadow-lg relative overflow-hidden transition-all"
          style={{
            backgroundColor: currentTeam ? `${currentTeam.color}15` : '#171717',
            borderColor: currentTeam ? `${currentTeam.color}50` : '#262626',
          }}
        >
          {/* Subtle glow circle */}
          <div
            className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: currentTeam?.color || '#F59E0B' }}
          />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900/80 border border-neutral-700/80 text-white">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentTeam?.color || '#F59E0B' }}
              />
              <span>{STRINGS.waitingTurn.title(currentTeam?.name || '')}</span>
            </div>

            <div className="text-xl font-black text-white">
              {STRINGS.waitingTurn.speakerAnnounce(view.currentSpeakerName || 'Объясняющий')}
            </div>

            {/* Role instructions */}
            <div className="pt-2">
              {isSpeaker ? (
                <div className="space-y-1">
                  <div className="text-amber-400 font-extrabold text-sm flex items-center justify-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    <span>{STRINGS.waitingTurn.youAreSpeaker}</span>
                  </div>
                  <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                    {STRINGS.waitingTurn.speakerInstruction}
                  </p>
                </div>
              ) : isMyTeamTurn ? (
                <div className="space-y-1 text-emerald-300">
                  <div className="font-extrabold text-sm flex items-center justify-center gap-1.5">
                    <Ear className="w-4 h-4" />
                    <span>Ход вашей команды!</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    {STRINGS.waitingTurn.teammatesInstruction}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 text-neutral-300">
                  <div className="font-extrabold text-sm flex items-center justify-center gap-1.5 text-neutral-200">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Следите за игрой</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {STRINGS.waitingTurn.opponentsInstruction(currentTeam?.name || 'соперников')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-2">
        {isSpeaker ? (
          <button
            data-testid="guesser-show-task"
            onClick={handleShowTask}
            className="w-full py-5 rounded-3xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-base tracking-wide flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <Eye className="w-6 h-6 stroke-[2.5]" />
            <span>{STRINGS.waitingTurn.showTaskBtn}</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Ждём, пока объясняющий нажмёт «Показать слово»...</span>
          </div>
        )}
      </div>
    </div>
  );
};
