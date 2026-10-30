/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { Users2, ArrowRight } from 'lucide-react';
import { TeamBadge } from '../components/TeamBadge';
import { VisualStyle } from '../theme/tokens';

interface SeatingScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const SeatingScreen: React.FC<SeatingScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
}) => {
  const isHost = view.me.isHost;
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  const handleBeginPlay = () => {
    send({ type: 'BEGIN_PLAY' });
  };

  const cardClass =
    visualStyle === 'arcade'
      ? isLightMode
        ? 'bg-white border-2 border-neutral-900 rounded-2xl shadow-[4px_4px_0px_#0F172A]'
        : 'bg-neutral-900 border-2 border-white rounded-2xl shadow-[4px_4px_0px_#FFFFFF]'
      : visualStyle === 'glass'
      ? isLightMode
        ? 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl'
        : 'bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl'
      : isLightMode
      ? 'bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 rounded-3xl'
      : 'bg-neutral-900 border border-neutral-800 shadow-xl rounded-3xl';

  return (
    <div
      data-testid="guesser-phase-seating"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between transition-colors"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
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

        {/* Hero Title */}
        <div className="text-center py-2 space-y-1.5">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white mx-auto flex items-center justify-center mb-2 shadow-lg shadow-rose-500/20">
            <Users2 className="w-7 h-7" />
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${
              isLightMode ? 'text-neutral-900' : 'text-white'
            }`}
          >
            {STRINGS.seating.title}
          </h1>
          <p
            className={`text-[13px] font-medium max-w-xs mx-auto ${
              isLightMode ? 'text-neutral-600' : 'text-neutral-400'
            }`}
          >
            {STRINGS.seating.subtitle}
          </p>
        </div>

        {/* Big Teams cards for physical seating */}
        <div className="space-y-3">
          {view.teams.map((team) => {
            const teamPlayers = view.players.filter((p) => p.teamId === team.id);
            const isMyTeam = team.id === view.me.teamId;

            return (
              <div
                key={team.id}
                className={`p-4 border transition-all rounded-3xl ${
                  isMyTeam
                    ? isLightMode
                      ? 'border-neutral-400 bg-neutral-50 shadow-md ring-2 ring-neutral-400/30'
                      : 'border-neutral-500/70 bg-neutral-950/90 ring-2 ring-white/15'
                    : isLightMode
                    ? 'border-slate-200 bg-white'
                    : 'border-neutral-800/80 bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: team.color }}
                    />
                    <span
                      className={`text-base font-black ${
                        isLightMode ? 'text-neutral-900' : 'text-white'
                      }`}
                    >
                      {team.name}
                    </span>
                  </div>
                  {isMyTeam && (
                    <span className="px-3 py-1 rounded-full text-[13px] font-black bg-rose-500 text-white shadow-xs">
                      Твоя команда
                    </span>
                  )}
                </div>

                {/* Team members */}
                <div className="flex flex-wrap gap-2">
                  {teamPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`px-3 py-1.5 rounded-xl text-[13px] font-bold border transition-colors ${
                        player.id === view.me.playerId
                          ? isLightMode
                            ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-800 border-neutral-600 text-white'
                          : isLightMode
                          ? 'bg-slate-100 border-slate-200 text-neutral-800'
                          : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      {player.nickname}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4">
        {isHost ? (
          <button
            data-testid="guesser-begin-play"
            onClick={handleBeginPlay}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>{STRINGS.seating.hostReadyBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center text-[13px] font-bold flex items-center justify-center gap-2 ${
              isLightMode
                ? 'bg-white border-slate-200 text-neutral-700'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>{STRINGS.seating.waitingHost}</span>
          </div>
        )}
      </div>
    </div>
  );
};
