/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GuesserCommand, GuesserPlayerView, GuesserMode, ScoreMode } from '../types';
import { STRINGS } from '../texts';
import { Users, Shuffle, Play, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { VisualStyle } from '../theme/tokens';

interface LobbyScreenProps {
  view: GuesserPlayerView;
  send: (cmd: GuesserCommand) => void;
  onOpenRules: () => void;
  visualStyle?: VisualStyle;
  isLightMode?: boolean;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  view,
  send,
  onOpenRules,
  visualStyle = 'fiesta',
  isLightMode = false,
}) => {
  const isHost = view.me.isHost;

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

  // Visual style helpers
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
      data-testid="guesser-phase-lobby"
      className="flex flex-col flex-1 px-4 pb-6 space-y-4 max-w-md mx-auto w-full transition-colors"
    >
      {/* Title & Format Card */}
      <div className={`${cardClass} p-4 relative overflow-hidden transition-all`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1
                  className={`text-2xl font-black tracking-tight ${
                    isLightMode ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {STRINGS.appTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[13px] font-black bg-rose-500 text-white shadow-xs">
                  Party
                </span>
              </div>
              <p
                className={`text-[13px] font-medium ${
                  isLightMode ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                {STRINGS.appSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRules}
            className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center border transition-all ${
              isLightMode
                ? 'bg-slate-100 hover:bg-slate-200 text-neutral-800 border-slate-300'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
            }`}
            aria-label="Правила игры"
          >
            ?
          </button>
        </div>

        {/* Format Banner */}
        <div className="mt-3.5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
              {STRINGS.formats[view.format]}
            </span>
            <span
              className={`text-[13px] font-bold ${
                isLightMode ? 'text-neutral-700' : 'text-neutral-300'
              }`}
            >
              {STRINGS.lobby.playersCount(view.players.length)}
            </span>
          </div>
          <div
            className={`text-[13px] font-medium max-w-[170px] text-right truncate ${
              isLightMode ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
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
        <div className="bg-amber-500/20 border-2 border-amber-500 rounded-2xl p-3.5 flex items-center gap-3 text-amber-950 dark:text-amber-200 text-[13px] font-bold shadow-md">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <span>{STRINGS.lobby.unbalancedAlert}</span>
        </div>
      )}

      {/* Teams and Players list */}
      <div className={`${cardClass} p-4 space-y-3.5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" />
            <h2
              className={`text-base font-black ${
                isLightMode ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {STRINGS.lobby.teamsSetup}
            </h2>
          </div>
          {isHost && view.format === 'teams' && (
            <button
              onClick={handleShuffle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold border transition-all ${
                isLightMode
                  ? 'bg-slate-100 hover:bg-slate-200 text-neutral-800 border-slate-300'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{STRINGS.lobby.shuffle}</span>
            </button>
          )}
        </div>

        {/* Host team count selector */}
        {isHost && view.format === 'teams' && (
          <div
            className={`flex items-center justify-between rounded-2xl p-3 border ${
              isLightMode
                ? 'bg-slate-50 border-slate-200 text-neutral-800'
                : 'bg-neutral-950/70 border-neutral-800 text-neutral-200'
            }`}
          >
            <span className="text-[13px] font-bold">{STRINGS.lobby.teamsCountLabel}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: view.maxTeams - 1 }, (_, i) => i + 2).map((count) => (
                <button
                  key={count}
                  onClick={() => handleSetTeamsCount(count)}
                  className={`w-8 h-8 rounded-xl text-[13px] font-black transition-all ${
                    view.teamsCount === count
                      ? 'bg-rose-500 text-white shadow-md'
                      : isLightMode
                      ? 'bg-slate-200 text-neutral-700 hover:bg-slate-300'
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
        <div className="space-y-2.5">
          {view.teams.map((team) => {
            const teamPlayers = view.players.filter((p) => p.teamId === team.id);
            const isMyTeam = team.id === view.me.teamId;

            return (
              <div
                key={team.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isMyTeam
                    ? isLightMode
                      ? 'border-neutral-400 bg-neutral-50 shadow-sm ring-2 ring-neutral-400/30'
                      : 'border-neutral-500/70 bg-neutral-950/90 ring-2 ring-white/10'
                    : isLightMode
                    ? 'border-slate-200 bg-white'
                    : 'border-neutral-800/80 bg-neutral-950/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-md"
                      style={{ backgroundColor: team.color }}
                    />
                    <span
                      className={`text-sm font-black ${
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
                  <span
                    className={`text-[13px] font-mono font-bold ${
                      isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    {teamPlayers.length} игроков
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {teamPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold border transition-colors ${
                        player.id === view.me.playerId
                          ? isLightMode
                            ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                            : 'bg-neutral-800 border-neutral-600 text-white'
                          : isLightMode
                          ? 'bg-slate-100 border-slate-200 text-neutral-800'
                          : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      {player.isHost && <Crown className="w-3.5 h-3.5 text-amber-400" />}
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
      <div className={`${cardClass} p-4 space-y-4`}>
        <h2
          className={`text-base font-black ${
            isLightMode ? 'text-neutral-900' : 'text-white'
          }`}
        >
          Параметры партии
        </h2>

        {/* Mode: Step vs Sprint */}
        <div className="space-y-1.5">
          <label
            className={`text-[13px] font-bold block ${
              isLightMode ? 'text-neutral-700' : 'text-neutral-400'
            }`}
          >
            Режим хода
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {(['step', 'sprint'] as GuesserMode[]).map((m) => (
              <button
                key={m}
                disabled={!isHost}
                onClick={() => setMode(m)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  mode === m
                    ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500 font-black'
                    : isLightMode
                    ? 'border-slate-200 bg-slate-50 text-neutral-700'
                    : 'border-neutral-800 bg-neutral-950/50 text-neutral-400'
                } ${!isHost ? 'opacity-85 cursor-default' : 'hover:scale-[1.01]'}`}
              >
                <div
                  className={`text-sm ${
                    mode === m
                      ? isLightMode
                        ? 'text-rose-600'
                        : 'text-rose-400'
                      : isLightMode
                      ? 'text-neutral-900'
                      : 'text-white'
                  }`}
                >
                  {STRINGS.modes[m]}
                </div>
                <div
                  className={`text-[13px] mt-1 font-medium ${
                    isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  {m === 'step' ? '20 с / 1 слово' : '60 с на поток'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scoring: Soft vs Hard (hidden in pair format per section 5 table) */}
        {view.format !== 'pair' && (
          <div className="space-y-1.5">
            <label
              className={`text-[13px] font-bold block ${
                isLightMode ? 'text-neutral-700' : 'text-neutral-400'
              }`}
            >
              Режим очков
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['soft', 'hard'] as ScoreMode[]).map((sm) => (
                <button
                  key={sm}
                  disabled={!isHost}
                  onClick={() => setScoreMode(sm)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    scoreMode === sm
                      ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500 font-black'
                      : isLightMode
                      ? 'border-slate-200 bg-slate-50 text-neutral-700'
                      : 'border-neutral-800 bg-neutral-950/50 text-neutral-400'
                  } ${!isHost ? 'opacity-85 cursor-default' : 'hover:scale-[1.01]'}`}
                >
                  <div
                    className={`text-sm ${
                      scoreMode === sm
                        ? isLightMode
                          ? 'text-rose-600'
                          : 'text-rose-400'
                        : isLightMode
                        ? 'text-neutral-900'
                        : 'text-white'
                    }`}
                  >
                    {STRINGS.scoreModes[sm]}
                  </div>
                  <div
                    className={`text-[13px] mt-1 font-medium ${
                      isLightMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`}
                  >
                    {sm === 'soft' ? '+1 за верное' : '+1 соперникам за ошибку'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Circles and Words */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div
            className={`p-3 rounded-2xl border ${
              isLightMode
                ? 'bg-slate-50 border-slate-200'
                : 'bg-neutral-950/70 border-neutral-800'
            }`}
          >
            <div
              className={`text-[13px] font-bold mb-1.5 ${
                isLightMode ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              {STRINGS.lobby.circlesCount}
            </div>
            {isHost ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setMaxCircles(Math.max(1, maxCircles - 1))}
                  className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  -
                </button>
                <span
                  className={`font-mono font-black text-base ${
                    isLightMode ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {maxCircles}
                </span>
                <button
                  onClick={() => setMaxCircles(Math.min(10, maxCircles + 1))}
                  className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="font-mono font-black text-base">{maxCircles}</div>
            )}
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              isLightMode
                ? 'bg-slate-50 border-slate-200'
                : 'bg-neutral-950/70 border-neutral-800'
            }`}
          >
            <div
              className={`text-[13px] font-bold mb-1.5 ${
                isLightMode ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              {STRINGS.lobby.wordsCount}
            </div>
            {isHost ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTotalWords(Math.max(10, totalWords - 5))}
                  className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  -
                </button>
                <span
                  className={`font-mono font-black text-base ${
                    isLightMode ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {totalWords}
                </span>
                <button
                  onClick={() => setTotalWords(Math.min(100, totalWords + 5))}
                  className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-black hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="font-mono font-black text-base">{totalWords}</div>
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
            className={`w-full py-4 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              canStart
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white active:scale-[0.99] shadow-rose-500/25'
                : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{STRINGS.lobby.startGame}</span>
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
            <span>{STRINGS.lobby.waitingForHost}</span>
          </div>
        )}
      </div>
    </div>
  );
};
