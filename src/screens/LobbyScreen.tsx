/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GuesserCommand, GuesserPlayerView, GuesserMode, ScoreMode } from '../types';
import { STRINGS } from '../texts';
import { Users, Shuffle, Play, Crown, Sparkles, AlertCircle, Info } from 'lucide-react';

interface LobbyScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ view, send, onOpenRules }) => {
  const isHost = view.me.isHost;

  // Local state for host configuration changes before game starts
  const [mode, setMode] = useState<GuesserMode>(view.mode);
  const [scoreMode, setScoreMode] = useState<ScoreMode>(view.scoreMode);
  const [maxCircles, setMaxCircles] = useState<number>(view.maxCircles);
  const [totalWords, setTotalWords] = useState<number>(view.totalWordsInitial);

  const canStart = view.players.length >= 2;

  const handleStartGame = () => {
    if (!canStart) return;
    send({
      type: 'START_GAME',
      settings: {
        mode,
        scoreMode,
        maxCircles,
        totalWordsInitial: totalWords,
      },
    });
  };

  const handleShuffle = () => {
    send({ type: 'SHUFFLE_TEAMS' });
  };

  const handleSetTeamsCount = (count: number) => {
    send({ type: 'SET_TEAMS_COUNT', count });
  };

  return (
    <div
      data-testid="guesser-phase-lobby"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full"
    >
      {/* Title & Format Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">{STRINGS.appTitle}</h1>
              <p className="text-xs text-neutral-400">{STRINGS.appSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onOpenRules}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs flex items-center justify-center border border-neutral-700 transition-colors"
            aria-label="Правила игры"
          >
            ?
          </button>
        </div>

        {/* Format Banner */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-neutral-950">
              {STRINGS.formats[view.format]}
            </span>
            <span className="text-xs text-neutral-400">
              {STRINGS.lobby.playersCount(view.players.length)}
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 max-w-[170px] text-right truncate">
            {view.format === 'pair'
              ? STRINGS.formats.pairDesc
              : view.format === 'solo'
              ? STRINGS.formats.soloDesc
              : STRINGS.formats.teamsDesc}
          </div>
        </div>
      </div>

      {/* Unbalanced Warning Banner */}
      {view.teamsUnbalanced && (
        <div className="bg-amber-950/40 border border-amber-500/60 rounded-2xl p-3 flex items-center gap-3 text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{STRINGS.lobby.unbalancedAlert}</span>
        </div>
      )}

      {/* Teams and Players list */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-white">{STRINGS.lobby.teamsSetup}</h2>
          </div>
          {isHost && view.format === 'teams' && (
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-neutral-700 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{STRINGS.lobby.shuffle}</span>
            </button>
          )}
        </div>

        {/* Host team count selector */}
        {isHost && view.format === 'teams' && (
          <div className="flex items-center justify-between bg-neutral-950/60 rounded-2xl p-2.5 border border-neutral-800/80">
            <span className="text-xs text-neutral-300 font-medium">{STRINGS.lobby.teamsCountLabel}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: view.maxTeams - 1 }, (_, i) => i + 2).map((count) => (
                <button
                  key={count}
                  onClick={() => handleSetTeamsCount(count)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    view.teamsCount === count
                      ? 'bg-amber-500 text-neutral-950 shadow-xs'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Team cards with player badges */}
        <div className="space-y-2">
          {view.teams.map((team) => {
            const teamPlayers = view.players.filter((p) => p.teamId === team.id);
            const isMyTeam = team.id === view.me.teamId;

            return (
              <div
                key={team.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isMyTeam ? 'border-neutral-500/60 bg-neutral-950/80 ring-1 ring-white/10' : 'border-neutral-800/80 bg-neutral-950/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-xs"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="text-xs font-bold text-white">{team.name}</span>
                    {isMyTeam && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                        Твоя
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {teamPlayers.length} игроков
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {teamPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs border ${
                        player.id === view.me.playerId
                          ? 'bg-neutral-800 border-neutral-600 text-white font-semibold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      {player.isHost && <Crown className="w-3 h-3 text-amber-400" />}
                      <span>{player.nickname}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Settings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-sm space-y-3.5">
        <h2 className="text-sm font-bold text-white">Параметры партии</h2>

        {/* Mode: Step vs Sprint */}
        <div className="space-y-1.5">
          <label className="text-xs text-neutral-400 font-medium">Режим хода</label>
          <div className="grid grid-cols-2 gap-2">
            {(['step', 'sprint'] as GuesserMode[]).map((m) => (
              <button
                key={m}
                disabled={!isHost}
                onClick={() => setMode(m)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  mode === m
                    ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950/40 text-neutral-400'
                } ${!isHost ? 'opacity-80 cursor-default' : 'hover:border-neutral-700'}`}
              >
                <div className="text-xs">{STRINGS.modes[m]}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                  {m === 'step' ? '20 с / 1 слово' : '60 с на поток'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scoring: Soft vs Hard (hidden in pair format per section 5 table) */}
        {view.format !== 'pair' && (
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-400 font-medium">Режим очков</label>
            <div className="grid grid-cols-2 gap-2">
              {(['soft', 'hard'] as ScoreMode[]).map((sm) => (
                <button
                  key={sm}
                  disabled={!isHost}
                  onClick={() => setScoreMode(sm)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    scoreMode === sm
                      ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-400'
                  } ${!isHost ? 'opacity-80 cursor-default' : 'hover:border-neutral-700'}`}
                >
                  <div className="text-xs">{STRINGS.scoreModes[sm]}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                    {sm === 'soft' ? '+1 за верное' : '+1 соперникам за ошибку'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Circles and Words */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-neutral-950/60 p-2.5 rounded-2xl border border-neutral-800">
            <div className="text-xs text-neutral-400 mb-1">{STRINGS.lobby.circlesCount}</div>
            {isHost ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setMaxCircles(Math.max(1, maxCircles - 1))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-white">{maxCircles}</span>
                <button
                  onClick={() => setMaxCircles(Math.min(10, maxCircles + 1))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="font-mono font-bold text-sm text-white">{maxCircles}</div>
            )}
          </div>

          <div className="bg-neutral-950/60 p-2.5 rounded-2xl border border-neutral-800">
            <div className="text-xs text-neutral-400 mb-1">{STRINGS.lobby.wordsCount}</div>
            {isHost ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTotalWords(Math.max(10, totalWords - 5))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700"
                >
                  -
                </button>
                <span className="font-mono font-bold text-sm text-white">{totalWords}</span>
                <button
                  onClick={() => setTotalWords(Math.min(100, totalWords + 5))}
                  className="w-7 h-7 rounded-lg bg-neutral-800 text-white font-bold hover:bg-neutral-700"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="font-mono font-bold text-sm text-white">{totalWords}</div>
            )}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="pt-2">
        {isHost ? (
          <button
            data-testid="guesser-start-game"
            disabled={!canStart}
            onClick={handleStartGame}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
              canStart
                ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-[0.99] cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{STRINGS.lobby.startGame}</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{STRINGS.lobby.waitingForHost}</span>
          </div>
        )}
      </div>
    </div>
  );
};
