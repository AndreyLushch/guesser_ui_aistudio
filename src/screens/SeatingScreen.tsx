/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GuesserCommand, GuesserPlayerView } from '../types';
import { STRINGS } from '../texts';
import { Users2, ArrowRight } from 'lucide-react';
import { TeamBadge } from '../components/TeamBadge';

interface SeatingScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const SeatingScreen: React.FC<SeatingScreenProps> = ({ view, send, onOpenRules }) => {
  const isHost = view.me.isHost;
  const myTeam = view.teams.find((t) => t.id === view.me.teamId);

  const handleBeginPlay = () => {
    send({ type: 'BEGIN_PLAY' });
  };

  return (
    <div
      data-testid="guesser-phase-seating"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full justify-between"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <TeamBadge format={view.format} myTeam={myTeam} nickname={view.me.nickname} />
          <button
            onClick={onOpenRules}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs flex items-center justify-center border border-neutral-800"
          >
            ?
          </button>
        </div>

        {/* Hero Title */}
        <div className="text-center py-2 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
            <Users2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{STRINGS.seating.title}</h1>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">{STRINGS.seating.subtitle}</p>
        </div>

        {/* Big Teams cards for physical seating */}
        <div className="space-y-3">
          {view.teams.map((team) => {
            const teamPlayers = view.players.filter((p) => p.teamId === team.id);
            const isMyTeam = team.id === view.me.teamId;

            return (
              <div
                key={team.id}
                className={`rounded-3xl p-4 border transition-all ${
                  isMyTeam
                    ? 'border-neutral-400/60 shadow-lg ring-1 ring-white/20'
                    : 'border-neutral-800/80 bg-neutral-900/60'
                }`}
                style={{
                  backgroundColor: isMyTeam ? `${team.color}25` : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="text-base font-black text-white">{team.name}</span>
                  </div>
                  {isMyTeam && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-neutral-950">
                      Твоя команда
                    </span>
                  )}
                </div>

                {/* Team members */}
                <div className="flex flex-wrap gap-2">
                  {teamPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        player.id === view.me.playerId
                          ? 'bg-neutral-800 border-neutral-600 text-white shadow-xs'
                          : 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
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
            className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>{STRINGS.seating.hostReadyBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{STRINGS.seating.waitingHost}</span>
          </div>
        )}
      </div>
    </div>
  );
};
